import $rdf from '@zazuko/env/web.js'
import formats from '@rdfjs/formats'
import stream from 'readable-stream'
import DataGraph from "../src/components/data-graph.js";
import {AnyPointer} from "clownface";
import {Quad} from "@rdfjs/types";

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
        const dataset = $rdf.dataset()
        const quads = $rdf.formats.parsers.import(mediaType, stream.Readable.from(script.textContent))
        if (quads) {
          for await (const quad of quads) {
            dataset.add(quad)
          }
          graph = $rdf.clownface({ dataset })
          scriptGraphs.set(script, graph)
        }
      }

      if (graph) {
        graphs[graphName] = graph
      }
    }
  }

  return graphs
}

const mutationObserver = new MutationObserver(async () => {
  const graphs = await parseGraphs()

  const targets = document.querySelectorAll<DataGraph>(`[data-graph]:not(script)`)

  for (const target of targets) {
    const graphName = target.getAttribute('data-graph')
    if (!graphName) {
      continue;
    }
    if (graphs[graphName]) {
      target.graph = graphs[graphName]
    }
  }
})

mutationObserver.observe(document.body, {childList: true, subtree: true})
