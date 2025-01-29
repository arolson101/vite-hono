import { useState } from 'react'
import { ClockButton } from './ClockButton'

export default function App() {
  return (
    <html lang='en'>
      <head>
        <meta charSet='UTF-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <title>Hello, Hono with React!</title>
        <link rel='stylesheet' href='https://cdn.simplecss.org/simple.min.css' />
      </head>
      <body>
        <h1>Hello, Hono with React!</h1>
        <h2>Example of useState()</h2>
        <Counter />
        <h2>Example of API fetch()</h2>
        <ClockButton />
      </body>
    </html>
  )
}

function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>You clicked me {count} times</button>
}
