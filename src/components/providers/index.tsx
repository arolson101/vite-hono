import { PropsWithChildren } from 'react'
import { TRPCProvider } from './trpc-provider'

export function Providers({ children }: PropsWithChildren) {
  return <TRPCProvider>{children}</TRPCProvider>
}
