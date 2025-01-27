import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/server/serve-node.ts'],
  splitting: false,
  sourcemap: true,
  publicDir: true,
  // treeshake: true,
  // minify: true,
  target: 'node20',
  format: 'esm',
  outDir: 'dist',
  // noExternal: [/.*/],
})
