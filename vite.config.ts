import build from '@hono/vite-build/node'
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/node'
import tailwindcss from '@tailwindcss/vite'
import tanStackRouterVite from '@tanstack/router-plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import ssgBuild from './src/lib/hono/plugins/ssg'

export default defineConfig(({ mode }) => {
  // server is a seperate build mode because it pollutes the config- prevents css
  // from being written & changes output dir for ssg
  if (mode === 'server') {
    const port = 9999
    return {
      mode: 'production',
      plugins: [
        tsconfigPaths(),
        build({
          entry: 'src/server-prod.ts',
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
      ],
    }
  }

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
        entry: 'src/server-ssr.ts',
        adapter,
      }),
      ssgBuild({
        entry: 'src/server-ssr.ts',
        onComplete: () => {
          console.log('Forcing exit because SSG build hangs vite')
          process.exit(0)
        },
      }),
    ],
  }
})
