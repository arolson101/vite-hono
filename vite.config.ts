import build from '@hono/vite-build/node'
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/node'
import ssg from '@hono/vite-ssg'
import tailwindcss from '@tailwindcss/vite'
import tanStackRouterVite from '@tanstack/router-plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ mode }) => {
  const port = 9999
  return {
    plugins: [
      tailwindcss(),
      tsconfigPaths(),
      viteReact(),
      tanStackRouterVite(),
      devServer({
        entry: 'src/server.ts',
        adapter,
      }),
      build({
        entry: 'src/server.ts',
        minify: false,
        output: 'server.js',
        port,
        entryContentAfterHooks: [
          async appName => `import { serve } from '@hono/node-server'
serve({ fetch: ${appName}.fetch, port: ${port} }, () => {
  console.log(\`🚀 Server running at http://localhost:${port}\`)
})`,
        ],
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
  }
})
