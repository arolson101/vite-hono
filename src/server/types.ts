import { betterAuth } from 'better-auth'
import { LibSQLDatabase } from 'drizzle-orm/libsql'
import { Hono } from 'hono'
import { Logger } from 'pino'
import type { schema } from './db'
import { EnvVars } from './env'

export type AppDb = LibSQLDatabase<typeof schema>

type Auth = ReturnType<typeof betterAuth>
type Session = Auth['$Infer']['Session']

export interface AppBindings {
  Bindings: EnvVars
  Variables: {
    auth: Auth
    db: AppDb
    log: Logger
    session: Session['session'] | null
    user: Session['user'] | null
  }
}

export type AppOpenAPI = Hono<AppBindings>
