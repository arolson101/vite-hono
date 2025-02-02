import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'

const server = new Hono({ strict: false })

  /**
   * These two serveStatic's will be used to serve production assets.
   * Vite dev server handles assets during development.
   */
  .use('/assets/*', serveStatic({ root: './dist/public' }))
  .use('/favicon.ico', serveStatic({ path: './dist/public/favicon.ico' }))

export default server
