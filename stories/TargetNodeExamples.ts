import { html } from 'lit'
import './TargetNode.elements.js'
import '../src/components/rdf-environment.js'
import '../src/components/data-graph.js'
import '../src/components/target-node.js'
import { shrink } from '@zazuko/prefixes'
import type { GraphPointer } from 'clownface'

export interface SortingTargetNodesProps {
  targetClass: string
  orderBy: string
}

export const SortingTargetNodes = (props: SortingTargetNodesProps) => {
  return html`
    <rdf-environment>
      <data-graph data-graph="example">
        <p>
          Instances of <b><code>${props.targetClass}</code></b> sorted by <b><code>${props.orderBy}</code></b>
        </p>
        <target-node target-class="${props.targetClass}" order-by="${props.orderBy}">
          <vocabulary-table>
          </vocabulary-table>
        </target-node>
      </data-graph>
    </rdf-environment>
    <script data-graph="example" type="text/turtle" src="https://raw.githubusercontent.com/zazuko/rdf-vocabularies/refs/heads/master/ontologies/rdfs/rdfs.nq">
    </script>
  `
}

export const CustomSortingTargetNodes = (props: Pick<SortingTargetNodesProps, 'targetClass'>) => {
  return html`
    <rdf-environment>
      <data-graph data-graph="example">
        <p>
          Instances of <b><code>${props.targetClass}</code></b> sorted with <b><code>shrink</code></b> function
        </p>
        <target-node target-class="${props.targetClass}" .orderBy="${(node: GraphPointer) => shrink(node.value)}">
          <vocabulary-table>
          </vocabulary-table>
        </target-node>
      </data-graph>
    </rdf-environment>
    <script data-graph="example" type="text/turtle" src="https://raw.githubusercontent.com/zazuko/rdf-vocabularies/refs/heads/master/ontologies/rdfs/rdfs.nq">
    </script>
  `
}

export interface SortOrderProps {
  direction: 'asc' | 'desc'
}

export const SortOrderOfTargetNodes = (props: SortOrderProps) => {
  return html`
    <rdf-environment>
      <data-graph data-graph="example">
        <p>
          Direction: <b><code>${props.direction}</code></b>
        </p>
        <target-node target-class="rdf:Property" order-by="rdfs:label" order-dir="${props.direction}">
          <vocabulary-table>
          </vocabulary-table>
        </target-node>
      </data-graph>
    </rdf-environment>
    <script data-graph="example" type="text/turtle" src="https://raw.githubusercontent.com/zazuko/rdf-vocabularies/refs/heads/master/ontologies/rdfs/rdfs.nq">
    </script>
  `
}
