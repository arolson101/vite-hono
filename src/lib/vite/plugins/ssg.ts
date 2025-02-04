// adapted from https://github.com/honojs/vite-plugins/blob/main/packages/ssg/src/ssg.ts
import type { Hono } from 'hono'
import { toSSG } from 'hono/ssg'
import type { Plugin } from 'vite'
import { createServer } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

type SSGOptions = {
  entry?: string
  onComplete?: () => void
  dir?: string
}

export const defaultOptions = {
  entry: './src/index.tsx',
} satisfies SSGOptions

export const ssgBuild = (ssgOptions?: SSGOptions): Plugin => {
  const assets = new Map<string, string>()

  return {
    name: 'vite-plugin-ssg',
    apply: 'build',
    async config() {
      // Create a server to load the module
      {
        const entry = ssgOptions?.entry ?? defaultOptions.entry
        const server = await createServer({
          plugins: [tsconfigPaths()],
          configFile: false,
        })
        const module = await server.ssrLoadModule(entry)

        const app = module['default'] as Hono

        if (!app) {
          throw new Error(`Failed to find a named export "default" from ${entry}`)
        }

        const dir = ssgOptions?.dir ?? ''

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
      ssgOptions?.onComplete?.()
    },
  }
}

export default ssgBuild
