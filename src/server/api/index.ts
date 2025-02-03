import { createRoute, z } from '@hono/zod-openapi'
import { zValidator } from '@hono/zod-validator'
import { describeRoute } from 'hono-openapi'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { notFound, onError } from 'stoker/middlewares'
import { jsonContent } from 'stoker/openapi/helpers'
import { configureOpenAPI } from '../lib/configure-open-api'
import { createApiRouter } from '../lib/create-app'

const api = createApiRouter()
configureOpenAPI(api)

api.notFound(notFound)
api.onError(onError)

api.get(
  '/error',
  describeRoute({
    description: 'Test Error Route',
    responses: {
      [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
        z
          .object({ message: z.string() }) //
          .openapi({ default: { message: 'nothing' }, example: { message: 'Something bad' } }),
        'Tasks API index',
      ),
    },
  }),
  zValidator('json', z.object({ name: z.string() })),
  c => {
    const { name } = c.req.valid('json')
    throw new Error('Test Error')
  },
)

api.get(
  '/test',
  describeRoute({
    description: 'Test Route',
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        z
          .object({ message: z.string() }) //
          .openapi({ default: { message: 'nothing' }, example: { message: 'Something good' } }),
        'Tasks API index',
      ),
    },
  }),
  zValidator('json', z.object({ name: z.string() })),
  c => {
    const { name } = c.req.valid('json')
    return c.json({ message: `Hello ${name}` })
  },
)

export default api
