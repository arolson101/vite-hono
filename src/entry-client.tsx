import { scan } from 'react-scan'
import { StartClient } from '@tanstack/react-start'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createRouter } from './router'

if (import.meta.env.DEV) {
  scan({
    enabled: import.meta.env.DEV,
  })
}

const router = createRouter()

ReactDOM.hydrateRoot(document, <StartClient router={router} />)
