import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import server from './server'

const serverProd = new Hono({ strict: false })
  .route('/', server)

  /**
   * These two serveStatic's will be used to serve production assets.
   * Vite dev server handles assets during development.
   */
  .use('/*', serveStatic({ root: './dist/public' }))
  .use('/favicon.ico', serveStatic({ path: './dist/public/favicon.ico' }))

export default serverProd
