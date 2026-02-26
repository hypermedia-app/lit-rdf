import { html } from 'lit'
import '../src/components/data-graph.js'
import '../src/components/target-node.js'
import '../src/components/resource-label.js'
import '../src/components/rdf-environment.js'

export const ResourceLabel = () => {
  return html`
    <script data-graph="example" type="text/turtle">
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX ex: <http://example.com/>
      
      ex:node rdfs:label "Example node" .
    </script>
    <rdf-environment>
      <data-graph data-graph="example">
        <target-node target-subjects-of="rdfs:label">
          <resource-label></resource-label>
        </target-node>
      </data-graph>
    </rdf-environment>
  `
}
