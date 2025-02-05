import { serve } from '@hono/node-server'
import { env } from './env'
import app from './app'

const e = env()

serve({ fetch: app.fetch, port: e.PORT }, ({ port }) => {
  console.log(`🔥 Server running at http://localhost:${port}`)
})
