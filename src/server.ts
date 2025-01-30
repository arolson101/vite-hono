import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { onlySSG, ssgParams } from 'hono/ssg'
import type { RedirectStatusCode } from 'hono/utils/http-status'
import { serverHandler } from './App.tsx'
import { createRouter } from './router.tsx'

const server = new Hono()
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
        const router = createRouter()

        const { stream, statusCode } = await serverHandler({
          req: c.req.raw,
          renderProps: { router },
        })

        // Handle redirects
        if (router.state.redirect) {
          return c.redirect(router.state.redirect.href, router.state.redirect.code as RedirectStatusCode)
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
        // if (import.meta.env.DEV) return err

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
