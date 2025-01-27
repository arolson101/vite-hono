import { env } from 'hono/adapter'
import { createMiddleware } from 'hono/factory'
import { parseEnv } from '../env'

export const envMiddleware = createMiddleware(async (c, next) => {
  c.env = parseEnv(env(c))
  await next()
})
