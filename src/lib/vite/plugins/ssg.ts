// adapted from https://github.com/honojs/vite-plugins/blob/main/packages/ssg/src/ssg.ts
import type { Hono } from 'hono'
import { toSSG } from 'hono/ssg'
import type { InlineConfig, Plugin } from 'vite'
import { createServer } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

type SSGOptions = {
  entry: string
  onComplete?: () => void
  dir?: string
}

export const ssgBuild = (ssgOptions: SSGOptions & InlineConfig): Plugin => {
  const assets = new Map<string, string>()

  const { entry, onComplete, dir = '', ...viteOptions } = ssgOptions

  return {
    name: 'vite-plugin-ssg',
    apply: 'build',
    async config() {
      // Create a server to load the module
      {
        const server = await createServer({
          ...viteOptions,
          plugins: [tsconfigPaths()],
          configFile: false,
        })
        const module = await server.ssrLoadModule(entry)

        const app = module['default'] as Hono

        if (!app) {
          throw new Error(`Failed to find a named export "default" from ${entry}`)
        }

        const result = await toSSG(
          app,
          {
            writeFile: async (path, data: string) => {
              assets.set(path, data)
            },
            async mkdir() {},
          },
          { dir },
        )

        await server.close()

        if (!result.success) {
          throw result.error
        }
      }

      const input = Array.from(assets.keys())
      return {
        build: {
          rollupOptions: {
            input,
          },
        },
      }
    },

    async resolveId(source, importer, options) {
      if (assets.has(source)) {
        return { id: source }
      }
    },

    async load(id) {
      if (assets.has(id)) {
        return assets.get(id)
      }
    },

    async writeBundle(_outputOptions, bundle) {
      onComplete?.()
    },
  }
}

export default ssgBuild
