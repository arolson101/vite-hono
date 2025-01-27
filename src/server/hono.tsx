import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { envMiddleware, EnvVars } from './env'

const app = new Hono<{
  Bindings: EnvVars
}>()

if (process.env.NODE_ENV === 'development') {
  app.use('*', logger())
}

app.use(envMiddleware)

app.get('/api/clock', c => {
  return c.json({
    var: c.env.MY_VAR,
    time: new Date().toLocaleTimeString(),
  })
})

export default app
