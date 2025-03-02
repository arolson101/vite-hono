import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { passkey } from 'better-auth/plugins/passkey'
import type { UserId } from './db/ids'
import { type EnvVars } from './env'
import { type AppDb } from './types'

export const createAuth = (env: EnvVars, db: AppDb) =>
  betterAuth({
    secret: env.BETTER_AUTH_SECRET,
    socialProviders: {
      github: {
        clientId: env.GITHUB_ID,
        clientSecret: env.GITHUB_SECRET,
      },
    },
    plugins: [passkey()],
    database: drizzleAdapter(db, {
      provider: 'sqlite', // or "pg" or "mysql"
    }),
    user: {
      additionalFields: {
        profileId: {
          type: 'string',
        },
      },
    },
  })

export type Auth = ReturnType<typeof createAuth>
export type Session = Auth['$Infer']['Session']['session']
export type User = Omit<Auth['$Infer']['Session']['user'], 'id'> & { id: UserId }
