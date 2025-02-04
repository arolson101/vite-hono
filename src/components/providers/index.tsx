import { PropsWithChildren } from 'react'
import { ThemeProvider } from './theme-provider'
import { TRPCProvider } from './trpc-provider'

export function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider defaultTheme='dark' storageKey='theme'>
      <TRPCProvider>{children}</TRPCProvider>
    </ThemeProvider>
  )
}
