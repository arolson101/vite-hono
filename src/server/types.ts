import { betterAuth } from 'better-auth'
import { LibSQLDatabase } from 'drizzle-orm/libsql'
import { Hono } from 'hono'
import type { schema } from './db'
import { EnvVars } from './env'

export type AppDb = LibSQLDatabase<typeof schema>

export interface AppBindings {
  Bindings: EnvVars
  Variables: {
    // logger: PinoLogger
    auth: ReturnType<typeof betterAuth>
    db: AppDb
  }
}

export type AppOpenAPI = Hono<AppBindings>
