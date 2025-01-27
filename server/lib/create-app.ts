import { Hono } from 'hono'
import { notFound, onError, serveEmojiFavicon } from 'stoker/middlewares'
import { envMiddleware } from '~server/middleware/envMiddleware'
import { pinoLogger } from '~server/middleware/pinoLogger'
import { HonoEnv } from './app-types'

export function createApp() {
  const app = new Hono<HonoEnv>({ strict: false })
    .use(serveEmojiFavicon('⚡'))
    .use(envMiddleware) //
    .use(pinoLogger())
    .notFound(notFound)
    .onError(onError)

  return app
}
