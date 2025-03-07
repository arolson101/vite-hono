import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/server/serve-node.ts'],
  minify: false,
  format: 'esm',
  target: 'node16',
  silent: true,
  treeshake: true,
  cjsInterop: true,
  env: {
    //@ts-expect-error does actually support boolean
    DEV: true,
    //@ts-expect-error does actually support boolean
    PROD: false,
    //@ts-expect-error does actually support boolean
    SSR: true,
    NODE_ENV: 'production',
  },
  outDir: 'dist',
  async onSuccess() {
    console.log('Server build complete')
  },
})
