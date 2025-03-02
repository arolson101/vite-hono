import { LibSQLDatabase } from 'drizzle-orm/libsql'
import { Hono } from 'hono'
import { Logger } from 'pino'
import type { Auth, Session, User } from '~/server/auth'
import type { schema } from './db'
import { EnvVars } from './env'

export type AppDb = LibSQLDatabase<typeof schema>

export interface AppBindings {
  Bindings: EnvVars
  Variables: {
    auth: Auth
    db: AppDb
    log: Logger
    session: Session | null
    user: User | null
  }
}

export type AppOpenAPI = Hono<AppBindings>
