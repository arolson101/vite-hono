import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { except } from 'hono/combine'
import { isSSGContext } from 'hono/ssg'

const server = new Hono({ strict: false })

export default server
