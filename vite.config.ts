import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/node'
import tailwindcss from '@tailwindcss/vite'
import tanStackRouterVite from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ isSsrBuild, command }) => ({
  clearScreen: false,
  plugins: [
    tailwindcss(),
    tsconfigPaths(), //
    react(),
    tanStackRouterVite(),
    devServer({
      entry: 'src/server.ts',
      adapter,
    }),
  ],
}))
