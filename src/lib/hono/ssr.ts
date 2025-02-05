import { Context } from 'hono'
import { env } from 'hono/adapter'
import type { RedirectStatusCode } from 'hono/utils/http-status'
import { render } from '~/entry-server.tsx'

export async function ssr(c: Context) {
  try {
    // this happens during SSG (I don't know why); prevent a '.txt' file from being created
    if (c.req.path.includes('*')) {
      return c.notFound()
    }

    // console.log('rendering', c.req.path)
    const { router, stream, statusCode } = await render(c.req.path, c.req.raw.signal, getInjectedScripts(c))

    // Handle redirects
    if (router.state.redirect) {
      return c.redirect(router.state.redirect.href, router.state.redirect.statusCode as RedirectStatusCode)
    }

    let status = statusCode()

    // Handle 404 errors
    if (router.hasNotFoundMatch() && status !== 500) status = 404

    return new Response(stream as any, {
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
}

const preambleCode = `<script type="module">
    import RefreshRuntime from '/@react-refresh'
    RefreshRuntime.injectIntoGlobalHook(window)
    window.$RefreshReg$ = () => {}
    window.$RefreshSig$ = () => (type) => type
    window.__vite_plugin_react_preamble_installed__ = true
  </script>`

const viteClient = `<script type="module" src="/@vite/client"></script>`

function getInjectedScripts(c: Context) {
  const { NODE_ENV } = env(c)
  if (NODE_ENV === 'development') {
    return [preambleCode, viteClient]
  } else {
    return []
  }
}
