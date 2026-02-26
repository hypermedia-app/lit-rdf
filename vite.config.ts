/* eslint-disable import/no-extraneous-dependencies */
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import rollupNodePolyFill from 'rollup-plugin-polyfill-node'

export default {
  define: {
    global: 'window',
  },
  resolve: {
    alias: {
      stream: 'readable-stream',
      zlib: 'browserify-zlib',
      util: 'util',
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
      ],
    },
  },
  build: {
    rollupOptions: {
      plugins: [rollupNodePolyFill()],
    },
  },
}
