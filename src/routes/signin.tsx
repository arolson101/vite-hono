import { createFileRoute } from '@tanstack/react-router'
import SignIn from '~/components/sign-in'

export const Route = createFileRoute('/signin')({
  component: SignInComponent,
})

function SignInComponent() {
  return (
    <div>
      <h2>Sign In</h2>

      <SignIn />
    </div>
  )
}
