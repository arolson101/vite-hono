import { Hono } from 'hono'
import { compress } from 'hono/compress'

const server = new Hono({ strict: false }) //
  .use(compress())

export default server
