import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { passkey } from 'better-auth/plugins/passkey'
import { createMiddleware } from 'hono/factory'
import { cacheGlobal } from '~/lib/cacheGlobal'
import { AppBindings } from '~/server/types'

export const betterAuthMiddleware = createMiddleware<AppBindings>(async (c, next) => {
  const auth = cacheGlobal('auth', () =>
    betterAuth({
      secret: c.env.BETTER_AUTH_SECRET,
      socialProviders: {
        github: {
          clientId: c.env.GITHUB_ID,
          clientSecret: c.env.GITHUB_SECRET,
        },
      },
      plugins: [passkey()],
      database: drizzleAdapter(c.get('db'), {
        provider: 'sqlite', // or "pg" or "mysql"
      }),
    }),
  )

  c.set('auth', auth)
  await next()
})
