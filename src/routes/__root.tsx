import { isServer } from '@tanstack/react-query'
import type { ErrorComponentProps } from '@tanstack/react-router'
import { createRootRouteWithContext, ErrorComponent, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { StrictMode } from 'react'
import { Providers } from '~/components/providers'
import type { RootRouterContext } from '~/router.ts'

export const Route = createRootRouteWithContext<RootRouterContext>()({
  component: RootComponent,
  errorComponent: RootErrorComponent,
})

function RootComponent() {
  return (
    <StrictMode>
      <Providers>
        <html lang='en' suppressHydrationWarning>
          <head>
            <meta charSet='utf-8' />
            <meta name='viewport' content='width=device-width, initial-scale=1' />
            <script suppressHydrationWarning>
              {`
              const systemDarkModeClass = window.matchMedia('(prefers-color-scheme: dark)').matches && 'dark';
              const darkModeClass = localStorage.getItem('theme') ?? systemDarkModeClass;
              document.querySelector('html').classList.add(darkModeClass);
              `}
            </script>

            {isServer && (
              <>
                <link rel='stylesheet' href='/src/global.css' />
                <script type='module' src='/src/entry-client.tsx'></script>
              </>
            )}
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
    </StrictMode>
  )
}

function RootErrorComponent({ error }: ErrorComponentProps) {
  if (error instanceof Error) {
    return <div>{error.message}</div>
  }

  return <ErrorComponent error={error} />
}
