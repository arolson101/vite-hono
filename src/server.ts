import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { mergeReadableStreams } from '@std/streams/merge-readable-streams'
import '@ungap/with-resolvers'
import viteReact from '@vitejs/plugin-react'
import { Hono } from 'hono'
import { env } from 'hono/adapter'
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

        async function getInjectedScript() {
          const clientScript = `<script type='module' src='/src/entry-client.tsx'></script>`

          const { NODE_ENV } = env(c)
          if (NODE_ENV === 'development') {
            const preambleCode = `<script type="module">${viteReact.preambleCode.replace('__BASE__', '/')}</script>`
            const viteClient = `<script type="module" src="/@vite/client"></script>`
            return preambleCode + viteClient + clientScript
          } else {
            return clientScript
          }
        }

        const injectedItems = promisesToStream(...router.serverSsr!.injectedHtml, getInjectedScript())

        return new Response(mergeReadableStreams(stream, injectedItems), {
          status,
          headers: { 'Content-Type': 'text/html' },
        })
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

function promisesToStream(...promises: Promise<string>[]) {
  return new ReadableStream({
    start(controller) {
      promises.forEach(promise => {
        promise.then(value => {
          controller.enqueue(new TextEncoder().encode(value))
        })
      })
      Promise.allSettled(promises).then(() => {
        controller.close()
      })
    },
  })
}

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
