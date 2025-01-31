import build from '@hono/vite-build/node'
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/node'
import ssg from '@hono/vite-ssg'
import tailwindcss from '@tailwindcss/vite'
import tanStackRouterVite from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ mode }) => {
  return {
    build: {
      rollupOptions: {
        input: './src/entry-client.tsx',
        output: {
          dir: './dist/static',
          entryFileNames: 'client.js',
        },
      },
      copyPublicDir: false,
      plugins: [
        tailwindcss(),
        tsconfigPaths(),
        react(),
        tanStackRouterVite(),
        devServer({
          entry: 'src/server.ts',
          adapter,
        }),
        mode !== 'client' && [
          build({
            entry: 'src/server.ts',
            minify: false,
            output: 'server.js',
          }),
          ssg({
            entry: 'src/server.ts',
          }),
          {
            name: 'ssg-exiter',
            apply: 'build',
            enforce: 'post',
            async writeBundle() {
              await new Promise(resolve => setTimeout(resolve, 1))
              console.log('Forcing exit because SSG build hangs vite')
              process.exit(0)
            },
          },
        ],
      ],
    },
  }
})
