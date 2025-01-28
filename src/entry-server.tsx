import * as React from 'react'
import { renderToString } from 'react-dom/server'
import { App } from './App'

/**
 * @param {string} _url
 */
export function render(_url: string) {
  return renderToString(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}
