import factory from '@zazuko/env/web.js'
import type { Quad } from '@rdfjs/types'

declare global {
  interface Window {
    graphs?: Record<string, (options: { factory: typeof factory }) => Quad[]>
  }
}

type DataGraphElement = Element & { graph?: ReturnType<typeof factory.clownface> }

document.querySelectorAll('[data-graph]').forEach((el: DataGraphElement) => {
  const graphName = el.getAttribute('data-graph')
  if (graphName && window.graphs?.[graphName]) {
    const dataset = factory.dataset(window.graphs[graphName]({ factory }))
    el.graph = factory.clownface({ dataset })
  }
})
