import { passkeyClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  plugins: [passkeyClient()],
})

export const { signIn, signOut, signUp, useSession } = authClient
