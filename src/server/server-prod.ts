import { serveStatic } from '@hono/node-server/serve-static'
import { compress } from 'hono/compress'
import server from './server'
import staticRoutes from './server-ssr-static-routes'

const serverProd = server

  /**
   * These two serveStatic's will be used to serve production assets.
   * Vite dev server handles assets during development.
   */
  .route('/', staticRoutes)
  .use('/*', compress(), serveStatic({ root: './dist/public' }))
  .use('/favicon.ico', compress(), serveStatic({ path: './dist/public/favicon.ico' }))

export default serverProd
