import { createMemoryHistory } from '@tanstack/react-router'
import { StartServer } from '@tanstack/start/server'
import ReactDOMServer from 'react-dom/server'
// @ts-expect-error https://github.com/facebook/react/issues/26906
import ReactDOMServerBrowser from 'react-dom/server.browser'
import { createRouter } from './router'

const renderToReadableStream = ReactDOMServer.renderToReadableStream ?? ReactDOMServerBrowser.renderToReadableStream

export async function render(url: string, signal: AbortSignal) {
  const router = createRouter()

  const memoryHistory = createMemoryHistory({
    initialEntries: [url],
  })

  router.update({
    history: memoryHistory,
  })

  await router.load()

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

  return {
    router,
    stream,
    statusCode: () => status,
  }
}
