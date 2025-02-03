import type { ErrorComponentProps } from '@tanstack/react-router'
import { createRootRouteWithContext, ErrorComponent, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Providers } from '~/components/providers'
import type { RootRouterContext } from '~/router.ts'

export const Route = createRootRouteWithContext<RootRouterContext>()({
  component: RootComponent,
  errorComponent: RootErrorComponent,
})

function RootComponent() {
  return (
    <Providers>
      <html lang='en'>
        <head>
          <meta charSet='utf-8' />
          <meta name='viewport' content='width=device-width, initial-scale=1' />
        </head>

        <body>
          <div className='root-nav'>
            <Link to='/' className='[&.active]:font-bold'>
              Home
            </Link>

            <Link to='/lazy-component' className='[&.active]:font-bold'>
              Lazy Component
            </Link>

            <Link to='/redirect' className='[&.active]:font-bold'>
              Redirect
            </Link>

            <Link to='/admin' className='[&.active]:font-bold'>
              Admin
            </Link>
          </div>

          <hr />

          <div className='root-content'>
            <Outlet />
          </div>

          {import.meta.env.DEV && <TanStackRouterDevtools position='bottom-right' />}
        </body>
      </html>
    </Providers>
  )
}

function RootErrorComponent({ error }: ErrorComponentProps) {
  if (error instanceof Error) {
    return <div>{error.message}</div>
  }

  return <ErrorComponent error={error} />
}
