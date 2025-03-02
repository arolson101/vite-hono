import { isServer } from '@tanstack/react-query'
import type { ErrorComponentProps } from '@tanstack/react-router'
import { createRootRouteWithContext, ErrorComponent, HeadContent, Link, Outlet, Scripts } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import dedent from 'dedent'
import { StrictMode } from 'react'
import { Providers } from '~/components/providers'
import type { RootRouterContext } from '~/router.ts'

export const Route = createRootRouteWithContext<RootRouterContext>()({
  head(ctx) {
    return {
      meta: [{ charSet: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
      links: [
        {
          rel: 'stylesheet',
          href: '/src/global.css',
        },
      ],
      scripts: [
        {
          children: dedent`
            const systemDarkModeClass = window.matchMedia('(prefers-color-scheme: dark)').matches && 'dark';
            const darkModeClass = localStorage.getItem('theme') ?? systemDarkModeClass;
            document.querySelector('html').classList.add(darkModeClass);
          `,
        },
        {
          type: 'module',
          src: '/src/entry-client.tsx',
        },
      ],
    }
  },
  component: RootComponent,
  errorComponent: RootErrorComponent,
})

function RootComponent() {
  return (
    <StrictMode>
      <Providers>
        <html lang='en' suppressHydrationWarning>
          <head>
            <HeadContent />
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
          <Scripts />
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
