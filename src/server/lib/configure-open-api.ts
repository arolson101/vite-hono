import { apiReference } from '@scalar/hono-api-reference'
import { openAPISpecs } from 'hono-openapi'
import packageJson from '../../../package.json'
import type { AppOpenAPI } from '../types'

export function configureOpenAPI(api: AppOpenAPI) {
  api.get(
    '/openapi',
    openAPISpecs(api, {
      documentation: {
        info: { title: 'Hono API', version: packageJson.version, description: 'Greeting API' },
      },
    }),
  )

  api.get(
    '/reference',
    apiReference({
      theme: 'kepler',

      spec: {
        url: '/api/openapi',
      },
    }),
  )
}
