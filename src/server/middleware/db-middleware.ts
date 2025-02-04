import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import { createMiddleware } from 'hono/factory'
import { cacheGlobal } from '~/lib/cacheGlobal'
import { schema } from '~/server/db'
import { AppBindings } from '~/server/types'

export const dbMiddleware = createMiddleware<AppBindings>(async (c, next) => {
  const client = cacheGlobal('client', () => createClient({ url: c.env.DB_FILE }))
  const db = drizzle(client, { schema })
  c.set('db', db)
  await next()
})
