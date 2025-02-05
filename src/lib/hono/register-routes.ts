import { AnyRouter } from '@tanstack/react-router'
import { Hono, MiddlewareHandler } from 'hono'
import { ssgParams } from 'hono/ssg'

export function registerRoutes(app: Hono<any>, router: AnyRouter, handler: MiddlewareHandler) {
  router.flatRoutes.forEach(route => {
    const fullPath = route.fullPath as string
    const reqPath =
      fullPath
        .replaceAll('$', ':') // substitute tsr path param with hono path param
        .replace(/\/?$/, '') || '/' // remove trailing slash

    if (reqPath.includes(':')) {
      // create a map of request params beginning with ':' to the same param beginning with '$'
      const params = fullPath
        .split('/')
        .filter(part => part.includes('$'))
        .reduce(
          (acc, part) => {
            acc[part.replaceAll('$', '')] = part
            return acc
          },
          {} as Record<string, string>,
        )
      console.log(`app.use('${reqPath}', ssgParams([${JSON.stringify(params)}]), handler`)
      app.use(reqPath, ssgParams([params]), handler)
    } else {
      console.log(`app.use('${reqPath}', handler`)
      app.use(reqPath, handler)
    }
  })
}
