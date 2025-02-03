import { trpcServer } from '@hono/trpc-server'
import { Context, Hono } from 'hono'
import { dbMiddleware } from './middleware/db-middleware'
import { envMiddleware } from './middleware/env-middleware'
import serveEmojiFavicon from './middleware/serve-emoji-favicon'
import { appRouter, TRPCContext } from './trpc'
import { AppBindings } from './types'

const app = new Hono<AppBindings>({ strict: false }) //
app.use(envMiddleware)
app.use(dbMiddleware)
app.use(serveEmojiFavicon('🔥', '💧'))

app.use(
  '/trpc/*',
  trpcServer({
    router: appRouter,
    createContext(_opts, c: Context<AppBindings>): TRPCContext {
      return {
        env: c.env,
        db: c.var.db,
      }
    },
  }),
)

export default app
