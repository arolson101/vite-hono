import { serveStatic } from '@hono/node-server/serve-static'
import { trpcServer } from '@hono/trpc-server'
import { Context, Hono } from 'hono'
import { compress } from 'hono/compress'
import { logger } from 'hono/logger'
import { RedirectStatusCode } from 'hono/utils/http-status'
import { serverHandler } from '~/app'
import { registerRoutes } from '~/lib/hono/register-routes'
import { ssr } from '~/lib/hono/ssr'
import { createRouter } from '~/router'
import { betterAuthMiddleware } from './middleware/better-auth-middleware'
import { dbMiddleware } from './middleware/db-middleware'
import { envMiddleware } from './middleware/env-middleware'
import { logMiddleware } from './middleware/log-middleware'
import serveEmojiFavicon from './middleware/serve-emoji-favicon'
// import { staticRoutes } from './static-routes.gen'
import { appRouter, TRPCContext } from './trpc'
import { AppBindings } from './types'

export const emojiIcon = import.meta.env.DEV ? '💧' : '🔥'

const app = new Hono<AppBindings>({ strict: false })
app.use(envMiddleware)
app.use(logMiddleware)
app.use(dbMiddleware)
app.use(betterAuthMiddleware)
app.use(serveEmojiFavicon(emojiIcon))

if (import.meta.env.DEV) {
  app.use(logger())
}

app.on(['POST', 'GET'], '/api/auth/*', c => {
  const auth = c.get('auth')
  return auth.handler(c.req.raw)
})

app.use(
  '/trpc/*',
  trpcServer({
    router: appRouter,
    createContext(_opts, c: Context<AppBindings>): TRPCContext {
      return {
        env: c.env,
        log: c.var.log,
        db: c.var.db,
        user: c.var.user,
        session: c.var.session,
      }
    },
  }),
)

if (import.meta.env.PROD) {
  // IDK why this doens't work in dev
  // app.use(compress())
}

app.use('/assets/*', serveStatic({ root: './dist/public' }))

app.get('*', async c => {
  try {
    const router = createRouter()

    const { stream, statusCode } = await serverHandler({
      req: c.req.raw,
      renderProps: { router },
    })

    // await router.load()

    // Handle redirects
    if (router.state.redirect) {
      return c.redirect(router.state.redirect.href, router.state.redirect.code as RedirectStatusCode)
    }

    let status = statusCode()

    // Handle 404 errors
    if (router.hasNotFoundMatch() && status !== 500) status = 404

    return new Response(stream, { status, headers: { 'Content-Type': 'text/html' } })
  } catch (err: any) {
    /**
     * In development, pass the error back to the vite dev server to display in the
     * vite error overlay
     */
    if (import.meta.env.DEV) return err

    throw err
  }
})

// if (import.meta.env.DEV || import.meta.env.SSR) {
//  registerRoutes(app, createRouter(), ssr)
// } else {
//   for (const [route, path] of Object.entries(staticRoutes)) {
//     app.use(route, serveStatic({ path: `./dist/public${path}` }))
//   }
// }

// app.use('/*', serveStatic({ root: './dist/public' }))
// app.use('/favicon.ico', serveStatic({ path: './dist/public/favicon.ico' }))

export default app
