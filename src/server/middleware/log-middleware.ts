import { createMiddleware } from 'hono/factory'
import pino from 'pino'
import { cacheGlobal } from '~/lib/cacheGlobal'
import { AppBindings } from '~/server/types'

export const logMiddleware = createMiddleware<AppBindings>(async (c, next) => {
  const log = cacheGlobal('pino', () =>
    import.meta.env.PROD || import.meta.env.SSR
      ? pino({ level: c.env.LOG_LEVEL })
      : pino({
          level: 'debug',
          transport: {
            target: 'pino-pretty',
            options: {
              colorize: true,
              // singleLine: true,
              ignore: 'module',
              messageFormat: '[{module}] {msg}',
            },
          },
        }),
  )
  c.set('log', log)
  await next()
})
