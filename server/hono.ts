import { createApp } from './lib/create-app'

const app = createApp()

app.get('/api/clock', c => {
  return c.json({
    var: c.env.MY_VAR,
    time: new Date().toLocaleTimeString(),
  })
})

app.get('/index.html', async c => {
  const { render } = await import('../src/entry-server.tsx')
  const html = render(c.req.url)
  const rendered = '<!doctype html>\n' + html
  return c.html(rendered)
})

export default app
