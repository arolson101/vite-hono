import dedent from 'dedent'
import { Context } from 'hono'
import type { RedirectStatusCode } from 'hono/utils/http-status'
import { render } from '~/entry-server.tsx'

export async function ssr(c: Context) {
  try {
    // console.log('rendering', c.req.path)
    const { router, stream, statusCode } = await render(c.req.path, c.req.raw.signal, getInjectedScripts())

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

const preambleCode = dedent`
  <script type="module">
    import RefreshRuntime from '/@react-refresh'
    RefreshRuntime.injectIntoGlobalHook(window)
    window.$RefreshReg$ = () => {}
    window.$RefreshSig$ = () => (type) => type
    window.__vite_plugin_react_preamble_installed__ = true
  </script>
`

function getInjectedScripts() {
  if (import.meta.env.DEV && !import.meta.env.SSR) {
    return [preambleCode, styleTag('/src/global.css'), scriptTag('/src/entry-client.tsx')]
  } else {
    return []
    // return [styleTag('/assets/entry-client-qyW2uCox.css'), scriptTag('/assets/entry-client-Cnft2tth.js')]
  }
}

function scriptTag(src: string) {
  return `<script type="module" src="${src}"></script>`
}

function styleTag(href: string) {
  return `<link rel="stylesheet" href="${href}" />`
}
