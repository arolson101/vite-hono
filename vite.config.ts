import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/node'
import tailwindcss from '@tailwindcss/vite'
import tanStackRouterVite from '@tanstack/router-plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { config } from 'dotenv'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import ssgBuild from './src/lib/vite/plugins/ssg'
import tsupBuild from './src/lib/vite/plugins/tsup'
import { parseEnv } from './src/server/env'

// validate env vars before starting
config()
parseEnv(process.env)

export default defineConfig(() => {
  return {
    build: {
      outDir: 'dist/public',
      copyPublicDir: true,
    },
    plugins: [
      tailwindcss(),
      tsconfigPaths(),
      viteReact(),
      tanStackRouterVite(),
      devServer({
        entry: 'src/server/server-ssr.ts',
        adapter,
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
        exclude: [
          /.*\.css$/,
          /.*\.ts$/,
          /.*\.tsx$/,
          /^\/@.+$/,
          /\?t\=\d+$/,
          // /^\/favicon\.ico$/,
          /^\/static\/.+/,
          /^\/node_modules\/.*/,
        ],
      }),
      tsupBuild({
        entry: ['src/server/server-node.ts'],
        minify: false,
        format: 'esm',
        target: 'node16',
        silent: true,
        treeshake: true,
        cjsInterop: true,
        env: {
          //@ts-expect-error does actually support boolean
          DEV: false,
          //@ts-expect-error does actually support boolean
          PROD: true,
          NODE_ENV: 'production',
        },
        outDir: 'dist',
        async onSuccess() {
          console.log('Server build complete')
        },
      }),
      ssgBuild({
        entry: 'src/server/server-ssr.ts',
        onComplete: () => {
          console.log('Forcing exit because SSG build hangs vite')
          process.exit(0)
        },
      }),
    ],
  }
})
