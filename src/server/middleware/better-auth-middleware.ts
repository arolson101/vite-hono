import { createMiddleware } from 'hono/factory'
import { cacheGlobal } from '~/lib/cacheGlobal'
import { createAuth, type User } from '~/server/auth'
import { AppBindings } from '~/server/types'

export const betterAuthMiddleware = createMiddleware<AppBindings>(async (c, next) => {
  const auth = cacheGlobal('auth', () => createAuth(c.env, c.var.db))

  c.set('auth', auth)

  const session = await auth.api.getSession({ headers: c.req.raw.headers })

  if (!session) {
    c.set('user', null)
    c.set('session', null)
    return next()
  }

  c.set('user', session.user as User)
  c.set('session', session.session)

  await next()
})
