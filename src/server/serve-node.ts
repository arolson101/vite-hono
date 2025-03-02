import { serve } from '@hono/node-server'
import app, { emojiIcon } from './app'
import { env } from './env'

const e = env()

serve({ fetch: app.fetch, port: e.PORT }, ({ port }) => {
  console.log(`${emojiIcon} Server running at http://localhost:${port}`)
})
