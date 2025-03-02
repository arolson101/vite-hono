import { Await, createFileRoute, defer } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { Suspense } from 'react'
import { useSession } from '~/lib/better-auth/auth-client'
import { trpc } from '~/lib/trpc/react'
import { rand, sleep } from '~/utils.ts'

export const Route = createFileRoute('/')({
  loader: async () => {
    const deferred = loadData(1000, 'deferred')
    const critical = await loadData(100, 'critical')

    return {
      critical,
      deferred: defer(deferred),
    }
  },
  component: IndexComponent,
})

function IndexComponent() {
  const { critical, deferred } = Route.useLoaderData()

  const { data: hello } = trpc.hello.world.useQuery()

  trpc.hello.mySubscription.useSubscription(
    { lastEventId: 1 },
    {
      onData(data) {
        // console.log(data)
      },
    },
  )

  const session = useSession()

  return (
    <div>
      <h2>Home</h2>

      <p>{hello} from trpc!</p>

      <p>
        {session.data ? (
          <>Signed in as {session.data.user.name}</>
        ) : (
          <>
            Not signed in.
            <br />
            <Link to='/signin'>sign in</Link>
          </>
        )}
      </p>

      <p>This home route simply loads some data (with a simulated delay) and displays it.</p>

      <p>{critical}</p>

      <Suspense fallback={<p>Loading deferred...</p>}>
        <Await promise={deferred}>{data => <p>{data}</p>}</Await>
      </Suspense>
    </div>
  )
}

async function loadData(delay: number, name: string) {
  await sleep(delay)

  return `Home loader - ${name} - random value ${rand()}.`
}
