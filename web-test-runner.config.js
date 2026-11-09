import { esbuildPlugin } from '@web/dev-server-esbuild'
import { fromRollup } from '@web/dev-server-rollup'
import commonjs from '@rollup/plugin-commonjs'

export default {
  files: 'test/components/**/*.test.ts',
  plugins: [
    esbuildPlugin({ ts: true, tsconfig: 'tsconfig.json', target: 'auto' }),
    // WTR serves individual modules, so CommonJS imports must be hoisted instead of wrapped.
    fromRollup(commonjs)({ strictRequires: false }),
  ],
  nodeResolve: true,
  // Allow more time for Chrome to start on shared CI runners.
  browserStartTimeout: 60000,
  concurrency: 1,
  coverage: true,
}
