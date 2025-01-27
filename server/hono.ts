import { createApp } from './lib/create-app'

const app = createApp()

app.get('/api/clock', c => {
  return c.json({
    var: c.env.MY_VAR,
    time: new Date().toLocaleTimeString(),
  })
})

export default app
