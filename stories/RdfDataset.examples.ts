import { html } from 'lit'

import '../src/components/rdf-environment.js'
import '../src/components/rdf-dataset.js'
import '../src/components/rdf-graph.js'
import './RdfDataset.elements.js'
import type { StoryFn } from '@storybook/web-components-vite'
import type { GraphProps } from './common.js'

export const DatasetFromMultipleDefaultGraphSources: StoryFn<GraphProps<'1' | '2'>> = (props, { loaded }) => {
  return html`
    <rdf-environment>
      <rdf-dataset>
        <rdf-graph .value="${loaded.graph1}">
        </rdf-graph>
        <rdf-graph .value="${loaded.graph2}">
        </rdf-graph>
        
        <p>
          The dataset provided by the <code>rdf-dataset</code> element contains data from multiple sources 
          provided by the <code>rdf-graph</code> elements. By default, their contents are merged into the default graph.
        </p>
        <print-dataset></print-dataset>
      </rdf-dataset>
    </rdf-environment>
  `
}

export const DatasetWithNamedGraphs: StoryFn<GraphProps<'1' | '2'>> = (props, { loaded }) => {
  return html`
    <rdf-environment>
      <rdf-dataset>
        <rdf-graph graph="http://example.com/graph1" .value="${loaded.graph1}">
        </rdf-graph>
        <rdf-graph graph="http://example.com/graph2" .value="${loaded.graph2}">
        </rdf-graph>
        
        <p>
          By setting <code>[graph]</code> attribute on <code>rdf-graph</code> elements,
          the contents of each graph are stored in a named graph with the specified IRI.
        </p>
        <print-dataset></print-dataset>
      </rdf-dataset>
    </rdf-environment>
  `
}
