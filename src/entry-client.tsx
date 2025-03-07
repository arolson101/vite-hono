import React from 'react'
import ReactDOM from 'react-dom/client'
import { scan } from 'react-scan'
import { clientHandler } from '~/app.tsx'
import { createRouter } from './router'

if (import.meta.env.DEV) {
  scan({
    enabled: import.meta.env.DEV,
  })
}

async function hydrate() {
  const renderApp = await clientHandler({
    renderProps: { router: createRouter() },
  })

  ReactDOM.hydrateRoot(document, renderApp())
}

void hydrate()
