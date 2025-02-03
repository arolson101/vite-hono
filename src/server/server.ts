import { trpcServer } from '@hono/trpc-server'
import { Context, Hono } from 'hono'
import { envMiddleware } from './middleware/env-middleware'
import serveEmojiFavicon from './middleware/serve-emoji-favicon'
import { appRouter, HonoContext } from './trpc'
import { AppBindings } from './types'

const app = new Hono<AppBindings>({ strict: false }) //
app.use(envMiddleware)
app.use(serveEmojiFavicon('🔥', '💧'))

app.use(
  '/trpc/*',
  trpcServer({
    router: appRouter,
    createContext(_opts, c: Context<AppBindings>): HonoContext {
      return {
        env: c.env,
      }
    },
  }),
)

export default app
