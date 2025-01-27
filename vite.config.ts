import devServer, { defaultOptions } from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/node'
import react from '@vitejs/plugin-react'
import { config } from 'dotenv'
import { defineConfig } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
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
        mode: mode === 'client' ? 'production ' : 'development',
        build: {
          outDir: './dist/public',
          emptyOutDir: false,
        },
        plugins: [
          tsconfigPaths(),
          react({
            babel: {
              plugins: ['babel-plugin-react-compiler'],
            },
          }),
          createHtmlPlugin({
            minify: true,
            entry: 'src/entry-client.tsx',
            template: 'index.html',
            inject: {
              data: {
                title: 'test',
              },
            },
          }),
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
                ...defaultOptions.exclude!, //
                /.*\.html$/,
              ],
            }),
        ],
        server: {
          port: 9999,
        },
      }

    default:
      throw new Error(`Unexpected mode: ${mode}`)
  }
})
