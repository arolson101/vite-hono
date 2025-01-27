import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { compress } from 'hono/compress'
import { parseEnv } from './env'
import app from './hono'

const env = parseEnv(process.env)

app.use(compress())
app.use('*', serveStatic({ root: './public' }))
app.use('*', serveStatic({ path: './public/index.html' }))

serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  info => {
    console.log(`Server listening on http://localhost:${info.port}`)
  },
)
