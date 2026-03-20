import { html } from 'lit'
import '../src/components/data-graph.js'
import '../src/components/target-node.js'
import '../src/components/resource-label.js'
import '../src/components/rdf-environment.js'
import { ifDefined } from "lit/directives/if-defined.js"

export interface ResourceLabelProps {
  labelProp?: string
  targetNode?: string
}

export const ResourceLabel = ({ labelProp, targetNode = 'http://example.com/foo' }: ResourceLabelProps) => {
  return html`
    <script data-graph="example" type="text/turtle">
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      PREFIX ex: <http://example.com/>
      
      ex:foo 
        rdfs:label "Example node" ;
        skos:prefLabel "The Foo"
      .
      ex:bar 
        rdfs:label "Example node" ;
        skos:prefLabel "The Bar"
      .
    </script>
    <rdf-environment>
      <data-graph data-graph="example">
        <target-node target-node="${targetNode}">
          <resource-label predicate="${ifDefined(labelProp)}"></resource-label>
        </target-node>
      </data-graph>
    </rdf-environment>
  `
}
