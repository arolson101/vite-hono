import { config } from '@dotenvx/dotenvx'
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/node'
import tanStackRouterVite from '@tanstack/router-plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import ssgBuild from './src/lib/vite/plugins/ssg'
import ssgStaticRoutes from './src/lib/vite/plugins/ssg-static-routes'
import tsupBuild from './src/lib/vite/plugins/tsup'
import { parseEnv } from './src/server/env'

// validate env vars before starting
config({ quiet: true })
const e = parseEnv(process.env)

export default defineConfig(() => {
  return {
    server: {
      port: e.PORT,
    },
    build: {
      // minify: false,
      outDir: 'dist/public',
      copyPublicDir: true,
    },
    plugins: [
      tsconfigPaths(),
      viteReact({
        babel: {
          plugins: [['babel-plugin-react-compiler', {}]],
        },
      }),
      tanStackRouterVite(),
      devServer({
        entry: 'src/server/app.ts',
        adapter,
        env() {
          const result = config({
            quiet: true,
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
        entry: ['src/server/serve-node.ts'],
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
          //@ts-expect-error does actually support boolean
          SSR: false,
          NODE_ENV: 'production',
        },
        outDir: 'dist',
        async onSuccess() {
          console.log('Server build complete')
        },
      }),
      ssgStaticRoutes({
        routerPath: 'src/router.tsx',
        output: 'src/server/static-routes.gen.ts',
      }),
      ssgBuild({
        // mode: 'development',
        entry: 'src/server/app.ts',
        onComplete: () => {
          setTimeout(() => {
            console.log('Forcing exit because SSG build hangs vite')
            process.exit(0)
          }, 1000)
        },
      }),
    ],
  }
})
