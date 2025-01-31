import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { onlySSG, ssgParams } from 'hono/ssg'
import type { RedirectStatusCode } from 'hono/utils/http-status'
import { render } from './entry-server.tsx'

const server = new Hono()
  .use(logger())

  /**
   * These two serveStatic's will be used to serve production assets.
   * Vite dev server handles assets during development.
   */
  .use('/assets/*', serveStatic({ root: './dist/public' }))
  .use('/favicon.ico', serveStatic({ path: './dist/public/favicon.ico' }))

  .get(
    '*',
    ssgParams(async () => {
      return ['', 'lazy-component', 'redirect', 'admin', 'admin/members'].map(route => ({ '*': route }))
    }),
    async c => {
      try {
        const { router, stream, statusCode } = await render(c.req.path, c.req.raw.signal)

        // Handle redirects
        if (router.state.redirect) {
          return c.redirect(router.state.redirect.href, router.state.redirect.statusCode as RedirectStatusCode)
        }

        let status = statusCode()

        // Handle 404 errors
        if (router.hasNotFoundMatch() && status !== 500) status = 404

        return new Response(stream, { status, headers: { 'Content-Type': 'text/html' } })
      } catch (err) {
        /**
         * In development, pass the error back to the vite dev server to display in the
         * vite error overlay
         */
        if (import.meta.env.DEV) return err as void

        throw err
      }
    },
  )

/**
 * In development, vite handles starting up the server
 * In production, we need to start the server ourselves
 */
if (import.meta.env.PROD && !process.env['SSG']) {
  const port = Number(process.env['PORT'] || 3000)
  serve(
    {
      port,
      fetch: server.fetch,
    },
    () => {
      console.log(`🚀 Server running at http://localhost:${port}`)
    },
  )
}

export default server
