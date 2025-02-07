import { sqliteTable as table } from 'drizzle-orm/sqlite-core'
import * as t from 'drizzle-orm/sqlite-core'
import { user } from './auth-schema'

export const posts = table(
  'posts',
  {
    id: t.int().primaryKey({ autoIncrement: true }),
    slug: t.text().$default(() => generateUniqueString(16)),
    title: t.text(),
    ownerId: t.int('owner_id').references(() => user.id),
  },
  table => [t.uniqueIndex('slug_idx').on(table.slug), t.index('title_idx').on(table.title)],
)

export const comments = table('comments', {
  id: t.int().primaryKey({ autoIncrement: true }),
  text: t.text({ length: 256 }),
  postId: t.int('post_id').references(() => posts.id),
  ownerId: t.int('owner_id').references(() => user.id),
})

function generateUniqueString(length: number = 12): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let uniqueString = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    uniqueString += characters[randomIndex]
  }
  return uniqueString
}
