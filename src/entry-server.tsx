import { createMemoryHistory } from '@tanstack/react-router'
import { StartServer } from '@tanstack/react-start/server'
import ReactDOMServer from 'react-dom/server'
// @ts-expect-error https://github.com/facebook/react/issues/26906
import ReactDOMServerBrowser from 'react-dom/server.browser'
import { attachRouterServerSsrUtils, dehydrateRouter } from '~/lib/tsr/ssr-server'
import { createRouter } from '~/router'
import { transformReadableStreamWithRouter } from './lib/tsr/transformStreamWithRouter'

const renderToReadableStream = ReactDOMServer.renderToReadableStream ?? ReactDOMServerBrowser.renderToReadableStream

export async function render(url: string, signal: AbortSignal, injectedHtmls: string[]) {
  const router = createRouter()

  attachRouterServerSsrUtils(router, undefined)

  for (const injectedHtml of injectedHtmls) {
    router.serverSsr!.injectedHtml.push(Promise.resolve(injectedHtml))
  }

  const memoryHistory = createMemoryHistory({
    initialEntries: [url],
  })

  router.update({
    history: memoryHistory,
  })

  await router.load()

  dehydrateRouter(router)

  let status = 200

  const stream = await renderToReadableStream(
    <StartServer router={router} />, //
    {
      signal,
      onError(error, errorInfo) {
        status = 500
      },
    },
  )

  const responseStream = transformReadableStreamWithRouter(router, stream as any)

  return {
    router,
    stream: responseStream,
    statusCode: () => status,
  }
}
