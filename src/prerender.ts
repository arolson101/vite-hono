import fs from 'fs/promises'
import { toSSG } from 'hono/ssg'

process.env['SSG'] = 'true'

const { default: app } = await import('../dist/server.js')

const results = await toSSG(app, fs, {
  dir: './dist/public',
})

if (results.error) {
  console.error(results.error)
  process.exit(1)
} else {
  results.files.forEach(file => console.log(`generated ${file}`))
  console.log('SSG complete')
  process.exit(0)
}
