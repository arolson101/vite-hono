import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { loggerLink, splitLink, unstable_httpBatchStreamLink, unstable_httpSubscriptionLink } from '@trpc/client'
import { PropsWithChildren, useState } from 'react'
import SuperJSON from 'superjson'
import { makeLogger } from '~/lib/logger'
import { trpc } from '~/lib/trpc/react'

const log = makeLogger('trpc')

export function TRPCProvider({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: getTrpcLinks(),
    }),
  )
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}

function getBaseUrl() {
  if (typeof window !== 'undefined') return window.location.origin
  return `http://localhost:${process.env['PORT'] ?? 3000}`
}

function getTrpcLinks() {
  const opts = {
    transformer: SuperJSON,
    url: getBaseUrl() + '/trpc',
  }
  return [
    loggerLink({
      console: {
        log: log.debug.bind(log),
        error: log.error.bind(log),
      },
      enabled: op => import.meta.env.DEV || (op.direction === 'down' && op.result instanceof Error),
      colorMode: 'none',
    }),

    splitLink({
      // uses the httpSubscriptionLink for subscriptions
      condition: op => op.type === 'subscription',
      true: unstable_httpSubscriptionLink(opts),
      false: unstable_httpBatchStreamLink(opts),
    }),
  ]
}
