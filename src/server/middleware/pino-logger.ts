import { pinoLogger as logger2 } from 'hono-pino'
import { logger } from 'hono/logger'
import pino from 'pino'
import pretty from 'pino-pretty'
import { env } from '~/server/env'

export function pinoLogger() {
  return logger()
  // return logger({
  //   pino: pino(
  //     { level: env.LOG_LEVEL }, //
  //     env.NODE_ENV === 'production' ? undefined : pretty(),
  //   ),
  //   http: {
  //     reqId: () => crypto.randomUUID(),
  //   },
  // })
}
