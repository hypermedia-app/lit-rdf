import type { Preview } from '@storybook/web-components-vite'
import $rdf from '@zazuko/env/web.js'
import stringToStream from 'string-to-stream'

import './load-graph.js'
import {Quad} from "@rdfjs/types";

declare module '@rdfjs/types' {
  interface Stream extends AsyncGenerator<Quad> {}
}

const preview: Preview = {
  parameters: {
    docs: {
      canvas: {
        sourceState: 'hidden'
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
    const dataset = $rdf.dataset()
    let data = $rdf.clownface({ dataset })
    if (args.data) {
      const stream = $rdf.formats.parsers.import('text/turtle', stringToStream(args.data.toString()))!
      for await (const quad of stream) {
        dataset.add(quad)
      }
    }

    return {
      data,
    }
  }]
};

export default preview;
