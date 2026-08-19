import $rdf from '@zazuko/env/web.js'
import formats from '@rdfjs/formats'
import { Readable } from 'readable-stream'
import type DataGraph from '../src/components/data-graph.js'
import type { AnyPointer } from 'clownface'
import type { Quad } from '@rdfjs/types'

$rdf.formats.import(formats)

declare module '@rdfjs/types' {
  interface Stream extends AsyncGenerator<Quad> {}
}

const scriptGraphs = new WeakMap<HTMLScriptElement, AnyPointer>()

async function parseGraphs() {
  const graphs: Record<string, AnyPointer> = {}

  for (const script of document.querySelectorAll<HTMLScriptElement>('script[data-graph]')) {
    const graphName = script.getAttribute('data-graph')
    const mediaType = script.getAttribute('type')

    if (mediaType && graphName) {
      let graph = scriptGraphs.get(script)
      if (!graph) {
        graph = await parseOrFetch(script, mediaType)
        scriptGraphs.set(script, graph)
      }

      if (graph) {
        graphs[graphName] = graph
      }
    }
  }

  return graphs
}

async function parseOrFetch(script: HTMLScriptElement, mediaType: string) {
  const dataset = $rdf.dataset()
  let content: string | null | undefined

  if (script.src) {
    const response = await fetch(script.src)
    content = await response.text()
  }
  else {
    content = script.textContent
  }

  const stream = $rdf.formats.parsers.import(mediaType, Readable.from(content))
  if (stream) {
    for await (const quad of stream) {
      dataset.add(quad)
    }
  }
  return $rdf.clownface({ dataset })
}

const mutationObserver = new MutationObserver(async () => {
  const graphs = await parseGraphs()

  const targets = document.querySelectorAll<DataGraph>(`[data-graph]:not(script)`)

  for (const target of targets) {
    const graphName = target.getAttribute('data-graph')
    if (!graphName) {
      continue
    }
    if (graphs[graphName]) {
      target.graph = graphs[graphName]
    }
  }
})

mutationObserver.observe(document.body, { childList: true, subtree: true })
