import { useState } from 'react'

export function App() {
  return (
    <html lang='en'>
      <head>
        <meta charSet='UTF-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <title>Hello, Hono with React!</title>
        <link rel='stylesheet' href='https://cdn.simplecss.org/simple.min.css' />

        <script type='module'>
          {`
          import RefreshRuntime from "/@react-refresh"
          RefreshRuntime.injectIntoGlobalHook(window)
          window.$RefreshReg$ = () => {}
          window.$RefreshSig$ = () => (type) => type
          window.__vite_plugin_react_preamble_installed__ = true
        `}
        </script>
        <script type='module' src='/@vite/client'></script>
      </head>
      <body>
        <h1>Hello, Hono with React!</h1>
        <h2>Example of useState()</h2>
        <Counter />
        <h2>Example of API fetch()</h2>
        <ClockButton />

        <script type="module" src="/src/entry-client.tsx"></script>
      </body>
    </html>
  )
}

function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>You clicked me {count} times</button>
}

const ClockButton = () => {
  const [response, setResponse] = useState<string | null>(null)

  const handleClick = async () => {
    const response = await fetch('/api/clock')
    const data = await response.json()
    const headers = Array.from(response.headers.entries()).reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
    const fullResponse = {
      url: response.url,
      status: response.status,
      headers,
      body: data,
    }
    setResponse(JSON.stringify(fullResponse, null, 2))
  }

  return (
    <div>
      <button onClick={handleClick}>Get Server Time</button>
      {response && <pre>{response}</pre>}
    </div>
  )
}
