import { Hono } from 'hono'
import { envMiddleware } from '../middleware/env-middleware'
import serveEmojiFavicon from '../middleware/serve-emoji-favicon'
import { AppBindings } from '../types'

export function createApiRouter() {
  return new Hono<AppBindings>({ strict: false })
}

export function createApp() {
  const app = new Hono<AppBindings>({ strict: false }) //
    .use(envMiddleware)
    .use(serveEmojiFavicon('🔥', '💧'))
  return app
}
