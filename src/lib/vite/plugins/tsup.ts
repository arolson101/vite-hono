import { build, Options } from 'tsup'
import type { Plugin, ResolvedConfig } from 'vite'

export const tsupBuild = (options: Options): Plugin => {
  return {
    name: 'vite-plugin-tsup',
    apply: 'build',
    async configResolved(config: ResolvedConfig) {
      await build(options)
    },
  }
}

export default tsupBuild
