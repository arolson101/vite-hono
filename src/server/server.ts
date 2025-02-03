import { Hono } from 'hono'
import { EnvVars } from './env'
import { envMiddleware } from './middleware/env-middleware'
import serveEmojiFavicon from './middleware/serve-emoji-favicon'

const app = new Hono<{ Bindings: EnvVars }>({ strict: false }) //
  .use(envMiddleware)
  .use(serveEmojiFavicon('🔥', '💧'))

export default app
