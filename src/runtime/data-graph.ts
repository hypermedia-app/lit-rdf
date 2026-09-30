/**
 * Runtime script that finds all `rdf-graph` elements in the DOM
 * and populates their `.value` property with an RDF/JS Dataset initialized
 * from graph factory functions registered on `window.graphs`.
 */
import factory from '@zazuko/env/web.js'
import type { Quad } from '@rdfjs/types'

declare global {
  interface Window {
    graphs?: Record<string, (options: { factory: typeof factory }) => Quad[]>
  }
}

document.querySelectorAll('rdf-graph').forEach((el) => {
  if (el.id && window.graphs?.[el.id]) {
    el.value = factory.dataset(window.graphs[el.id]({ factory }))
  }
})
