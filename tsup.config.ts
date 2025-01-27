import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['server/serve-node.ts'],
  splitting: false,
  sourcemap: true,
  // publicDir: true,
  // treeshake: true,
  // minify: true,
  // target: 'node20',
  format: 'esm',
  outDir: 'dist',
  tsconfig: 'tsconfig.server.json',
  noExternal: [/~.*/],
})
