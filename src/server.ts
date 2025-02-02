import { serveStatic } from '@hono/node-server/serve-static'
import { mergeReadableStreams } from '@std/streams/merge-readable-streams'
import '@ungap/with-resolvers'
import { Hono } from 'hono'
import { env } from 'hono/adapter'
import { except } from 'hono/combine'
import { logger } from 'hono/logger'
import { onlySSG, ssgParams } from 'hono/ssg'
import type { RedirectStatusCode } from 'hono/utils/http-status'
import { render } from './entry-server.tsx'
import { createRouter } from './router.tsx'

const server = new Hono({ strict: false })
  .use(logger())

  /**
   * These two serveStatic's will be used to serve production assets.
   * Vite dev server handles assets during development.
   */
  .use('/assets/*', serveStatic({ root: './dist/public' }))
  .use('/favicon.ico', serveStatic({ path: './dist/public/favicon.ico' }))

  .get(
    '*',
    except(() => import.meta.env.DEV, onlySSG()),
    ssgParams(() => createRouter().flatRoutes.map(route => ({ '*': route.fullPath.substring(1) }))),
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
            const preambleCode = `<script type="module">
  import RefreshRuntime from '/@react-refresh'
  RefreshRuntime.injectIntoGlobalHook(window)
  window.$RefreshReg$ = () => {}
  window.$RefreshSig$ = () => (type) => type
  window.__vite_plugin_react_preamble_installed__ = true
</script>`
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
  let cancelled = false
  return new ReadableStream({
    start(controller) {
      promises.forEach(promise => {
        promise.then(value => {
          controller.enqueue(new TextEncoder().encode(value))
        })
      })
      Promise.allSettled(promises).then(() => {
        if (cancelled) return
        controller.close()
      })
    },
    cancel() {
      cancelled = true
    },
  })
}

export default server
