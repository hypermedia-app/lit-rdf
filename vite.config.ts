/* eslint-disable import/no-extraneous-dependencies */
import nodePolyfills from "@rolldown/plugin-node-polyfills";

export default {
  define: {
    global: 'window',
  },
  resolve: {
    alias: {
      stream: 'readable-stream',
    },
  },
  build: {
    rolldownOptions: {
      plugins: [nodePolyfills()]
    }
  },
}
