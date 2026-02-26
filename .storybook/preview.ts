import type { Preview } from '@storybook/web-components-vite'
import $rdf from '@zazuko/env'
import stringToStream from 'string-to-stream'
import process from 'process'
import { Buffer } from 'buffer'
import EventEmitter from 'events'

import './load-graph.js'

window.Buffer = Buffer
window.process = process
window.EventEmitter = EventEmitter

const preview: Preview = {
  parameters: {
    docs: {
      canvas: {
        sourceState: 'shown'
      }
    },
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
  loaders: [async ({ args }: Record<any, any>) => {
    let data = $rdf.clownface()
    if (args.data) {
      data = $rdf.clownface({
        dataset: await $rdf.dataset()
          .import($rdf.formats.parsers.import('text/turtle', stringToStream(args.data.toString()))!),
      })
    }

    return {
      data,
    }
  }]
};

export default preview;
