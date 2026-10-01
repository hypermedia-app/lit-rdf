import $rdf from '@zazuko/env/web'
import isUrl from 'is-url'
import formats from '@rdfjs/formats'
import { Readable } from 'readable-stream'
import type { DatasetCore } from '@rdfjs/types'

$rdf.formats.import(formats)

const graphCache = new Map<string, DatasetCore>()

export async function loadGraphData(contentOrUrl: string | URL): Promise<DatasetCore> {
  const key = typeof contentOrUrl === 'string' ? contentOrUrl : contentOrUrl.toString()
  const cached = graphCache.get(key)
  if (cached) {
    return cached
  }

  const dataset = $rdf.dataset()
  let content = key
  let mediaType = 'text/turtle'

  if (isUrl(content) || content.startsWith('http://') || content.startsWith('https://')) {
    const url = content
    const response = await fetch(url)
    const contentType = response.headers.get('content-type')
    if (contentType) {
      mediaType = contentType.split(';')[0]
    }
    if (url.endsWith('.nq') || url.endsWith('.nquads')) {
      mediaType = 'application/n-quads'
    }
    else if (url.endsWith('.nt')) {
      mediaType = 'application/n-triples'
    }
    else if (url.endsWith('.json') || url.endsWith('.jsonld')) {
      mediaType = 'application/ld+json'
    }
    else if (url.endsWith('.trig')) {
      mediaType = 'application/trig'
    }
    else if (url.endsWith('.ttl')) {
      mediaType = 'text/turtle'
    }
    content = await response.text()
  }

  const stream = $rdf.formats.parsers.import(mediaType, Readable.from(content))
  if (stream) {
    for await (const quad of stream) {
      dataset.add(quad)
    }
  }

  graphCache.set(key, dataset)
  return dataset
}
