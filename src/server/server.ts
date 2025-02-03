import { Hono } from 'hono'
import { envMiddleware } from './middleware/envMiddleware'

const app = new Hono({ strict: false }) //
  .use(envMiddleware)

export default app
