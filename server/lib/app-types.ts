import { PinoLogger } from 'hono-pino'
import { EnvVars } from '~server/env'

export type HonoEnv = {
  Bindings: EnvVars
  Variables: {
    logger: PinoLogger
  }
}
