import fs from 'node:fs'
import path from 'node:path'
import 'react'
import { fileURLToPath } from 'url'
import { build } from 'vite'

const __dirname = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
console.log('__dirname', __dirname)
const toAbsolute = p => path.resolve(__dirname, p)

const { render } = await import('../src/entry-server.tsx')

// // determine routes to pre-render from src/pages
// const routesToPrerender = fs.readdirSync(toAbsolute('src/pages')).map(file => {
//   const name = file.replace(/\.tsx$/, '').toLowerCase()
//   return name === 'home' ? `/` : `/${name}`
// })

;(async () => {
  // pre-render each route...
  // for (const url of routesToPrerender) {
  const url = '/'
  const html = render(url)
  const filePath = `./dist/public${url === '/' ? '/index' : url}.temp.html`
  fs.writeFileSync(toAbsolute(filePath), html)
  console.log(`pre-rendered: ${filePath}`)

  await build({
    root: path.resolve(__dirname, './'),
    mode: 'client',
    build: {
      outDir: path.resolve(__dirname, './dist/public'),
      
      emptyOutDir: false,

      rollupOptions: {
        input: {

          main: path.resolve(__dirname, filePath),
          // nested: path.resolve(__dirname, 'nested/index.html'),
        },
      },
    },
  })
  // }
})()
