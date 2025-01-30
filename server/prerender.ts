import { build, Plugin } from 'vite'

globalThis.React = await import('react')
const { render } = await import('../src/entry-server.tsx')

// // determine routes to pre-render from src/pages
// const routesToPrerender = fs.readdirSync(toAbsolute('src/pages')).map(file => {
//   const name = file.replace(/\.tsx$/, '').toLowerCase()
//   return name === 'home' ? `/` : `/${name}`
// })

build({
  mode: 'client',
  plugins: [prerenderPlugin()],
  build: {
    rollupOptions: {
      input: ['index.html', 'b.html'],
    },
  },
})

function prerenderPlugin(): Plugin {
  const script = '<script type="module" src="/src/entry-client.tsx"></script>'

  return {
    name: 'prerender',
    enforce: 'pre',

    resolveId(source, importer, options) {
      // console.log('resolveId', source)
      switch (source) {
        case 'index.html':
        case 'b.html':
          return { id: source }

        default:
          return this.resolve(source, importer, options)
      }
    },

    async load(id) {
      // console.log('load', id)
      switch (id) {
        case 'index.html':
        case 'b.html': {
          const html = await render('/')
          return html.replace('</body>', script + '</body>')
        }
      }
    },
  }
}
