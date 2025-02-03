import { Client, createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import { createMiddleware } from 'hono/factory'
import { schema } from '~/server/db'
import { AppBindings, AppDb } from '~/server/types'

type globalThisDb = { db?: AppDb }

export const dbMiddleware = createMiddleware<AppBindings>(async (c, next) => {
  const db = ((globalThis as globalThisDb).db ??= createDb(c.env.DB_FILE))
  c.set('db', db)
  await next()
})

function createDb(url: string) {
  console.log('createDb', url)
  const client = createClient({ url })
  const db = drizzle(client, { schema })
  return db
}
