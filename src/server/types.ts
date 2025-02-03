import { Hono } from 'hono'
import { EnvVars } from './env'

export interface AppBindings {
  Bindings: EnvVars
  Variables: {
    // logger: PinoLogger
  }
}

export type AppOpenAPI = Hono<AppBindings>
