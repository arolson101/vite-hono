import { serveStatic } from '@hono/node-server/serve-static'
import { trpcServer } from '@hono/trpc-server'
import { Context, Hono } from 'hono'
import { compress } from 'hono/compress'
import { logger } from 'hono/logger'
import { registerRoutes } from '~/lib/hono/register-routes'
import { ssr } from '~/lib/hono/ssr'
import { createRouter } from '~/router'
import { betterAuthMiddleware } from './middleware/better-auth-middleware'
import { dbMiddleware } from './middleware/db-middleware'
import { envMiddleware } from './middleware/env-middleware'
import { logMiddleware } from './middleware/log-middleware'
import serveEmojiFavicon from './middleware/serve-emoji-favicon'
import { staticRoutes } from './static-routes.gen'
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
  app.use(compress())
}

if (import.meta.env.DEV || import.meta.env.SSR) {
  registerRoutes(app, createRouter(), ssr)
} else {
  for (const [route, path] of Object.entries(staticRoutes)) {
    app.use(route, serveStatic({ path: `./dist/public${path}` }))
  }
}

app.use('/*', serveStatic({ root: './dist/public' }))
// app.use('/favicon.ico', serveStatic({ path: './dist/public/favicon.ico' }))

export default app
