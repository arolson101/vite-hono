import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/node'
import react from '@vitejs/plugin-react'
import { config } from 'dotenv'
import { defineConfig, type Plugin } from 'vite'
import { sri } from 'vite-plugin-sri3'
import tsconfigPaths from 'vite-tsconfig-paths'
import { parseEnv } from './server/env'

type ModeType = 'development' | 'client' | 'server'

// validate env vars before starting
config()
parseEnv(process.env)

export default defineConfig(({ mode }) => {
  switch (mode as ModeType) {
    case 'client':
    case 'development':
      return {
        clearScreen: false,
        mode: mode === 'client' ? 'production ' : 'development',
        build: {
          outDir: './dist/public',
          emptyOutDir: false,
        },
        resolve: {
          preserveSymlinks: true,
        },
        plugins: [
          tsconfigPaths(),
          react({
            babel: {
              plugins: ['babel-plugin-react-compiler'],
            },
          }),
          mode === 'development' && prerenderPlugin(),
          mode === 'development' &&
            devServer({
              env() {
                const result = config({
                  override: true,
                  // debug: true,
                })
                if (result.error) {
                  throw result.error
                }
                return result.parsed!
              },
              adapter,
              entry: 'server/hono.ts',
              exclude: [
                // only use dev server on /api calls
                /^(?!\/api\/).*$/i,
              ],
              injectClientScript: false,
            }),
          sri(),
        ],
        server: {
          port: 9999,
        },
      }

    default:
      throw new Error(`Unexpected mode: ${mode}`)
  }
})

const reactPreamble = `
<script type="module">
  import RefreshRuntime from '/@react-refresh'
  RefreshRuntime.injectIntoGlobalHook(window)
  window.$RefreshReg$ = () => {}
  window.$RefreshSig$ = () => (type) => type
  window.__vite_plugin_react_preamble_installed__ = true
</script>`

const viteClient = `
<script type="module" src="/@vite/client"></script>`

async function prerenderPlugin(): Promise<Plugin> {
  const modulePath = './src/entry-server.tsx'
  const script = '<script type="module" src="/src/entry-client.tsx"></script>'

  return {
    name: 'prerender',
    enforce: 'pre',

    async transformIndexHtml(html, { server, path }) {
      // console.log('transformIndexHtml', path)
      if (server) {
        const module = await server?.ssrLoadModule(modulePath, { fixStacktrace: true })
        if (!module) throw new Error('module not found')
        const { render } = module
        if (!render) throw new Error('render export not found')

        html = await render('/')
        html = html.replace('</head>', reactPreamble + viteClient + '</head>')
        html = html.replace('</body>', script + '</body>')
      }

      return html
    },
  }
}
