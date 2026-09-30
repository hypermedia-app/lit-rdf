import { html } from 'lit'

import '../src/components/rdf-environment.js'
import '../src/components/rdf-dataset.js'
import '../src/components/rdf-graph.js'
import './RdfDataset.elements.js'

export const DatasetFromMultipleDefaultGraphSources = () => {
  return html`
    <rdf-environment>
      <rdf-dataset>
        <rdf-graph id="graph1">
        </rdf-graph>
        <rdf-graph id="graph2">
        </rdf-graph>
        
        <p>
          The dataset provided by the <code>rdf-dataset</code> element contains data from multiple sources 
          provided by the <code>rdf-graph</code> elements. By default, their contents are merged into the default graph.
        </p>
        <print-dataset></print-dataset>
      </rdf-dataset>
    </rdf-environment>
    <script data-graph="graph1" type="text/turtle">
      prefix ex: <http://example.com/>
      ex:foo ex:from "graph1" .
    </script>
    <script data-graph="graph2" type="text/turtle">
      prefix ex: <http://example.com/>
      ex:bar ex:from "graph2" .
    </script>
  `
}

export const DatasetWithNamedGraphs = () => {
  return html`
    <rdf-environment>
      <rdf-dataset>
        <rdf-graph id="graph1" graph="http://example.com/graph1">
        </rdf-graph>
        <rdf-graph id="graph2" graph="http://example.com/graph2">
        </rdf-graph>
        
        <p>
          By setting <code>[graph]</code> attribute on <code>rdf-graph</code> elements,
          the contents of each graph are stored in a named graph with the specified IRI.
        </p>
        <print-dataset></print-dataset>
      </rdf-dataset>
    </rdf-environment>
    <script data-graph="graph1" type="text/turtle">
      prefix ex: <http://example.com/>
      ex:foo ex:from "graph1" .
    </script>
    <script data-graph="graph2" type="text/turtle">
      prefix ex: <http://example.com/>
      ex:bar ex:from "graph2" .
    </script>
  `
}
