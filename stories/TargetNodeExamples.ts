import { html } from 'lit'
import './TargetNode.elements.js'
import '../src/components/rdf-environment.js'
import '../src/components/rdf-dataset.js'
import '../src/components/rdf-graph.js'
import '../src/components/target-node.js'
import { shrink } from '@zazuko/prefixes'
import type { GraphPointer } from 'clownface'
import type { StoryFn } from '@storybook/web-components-vite'
import type { GraphProps } from './common.js'

export interface SortingTargetNodesProps extends GraphProps {
  targetClass: string
  orderBy: string
}

export const SortingTargetNodes: StoryFn<SortingTargetNodesProps> = (props, { loaded }) => {
  return html`
    <rdf-environment>
      <rdf-dataset>
        <rdf-graph .value="${loaded.graph}"></rdf-graph>
        <p>
          Instances of <b><code>${props.targetClass}</code></b> sorted by <b><code>${props.orderBy}</code></b>
        </p>
        <target-node target-class="${props.targetClass}" order-by="${props.orderBy}">
          <vocabulary-table>
          </vocabulary-table>
        </target-node>
      </rdf-dataset>
    </rdf-environment>
  `
}

export const CustomSortingTargetNodes: StoryFn<SortingTargetNodesProps> = (props, { loaded }) => {
  return html`
    <rdf-environment>
      <rdf-dataset>
        <rdf-graph .value="${loaded.graph}"></rdf-graph>
        <p>
          Instances of <b><code>${props.targetClass}</code></b> sorted with <b><code>shrink</code></b> function
        </p>
        <target-node target-class="${props.targetClass}" .orderBy="${(node: GraphPointer) => shrink(node.value)}">
          <vocabulary-table>
          </vocabulary-table>
        </target-node>
      </rdf-dataset>
    </rdf-environment>
  `
}

export interface SortOrderProps extends GraphProps {
  direction: 'asc' | 'desc'
}

export const SortOrderOfTargetNodes: StoryFn<SortOrderProps> = (props, { loaded }) => {
  return html`
    <rdf-environment>
      <rdf-dataset>
        <rdf-graph .value="${loaded.graph}"></rdf-graph>
        <p>
          Direction: <b><code>${props.direction}</code></b>
        </p>
        <target-node target-class="rdf:Property" order-by="rdfs:label" order-dir="${props.direction}">
          <vocabulary-table>
          </vocabulary-table>
        </target-node>
      </rdf-dataset>
    </rdf-environment>
  `
}

export interface SortingLiteralsProps extends GraphProps {
  orderBy: 'schema:age' | 'schema:baseSalary' | 'schema:birthDate'
  direction: 'asc' | 'desc'
}

export const SortingLiterals: StoryFn<SortingLiteralsProps> = (props, { loaded }) => {
  return html`
    <rdf-environment>
      <rdf-dataset>
        <rdf-graph .value="${loaded.graph}"></rdf-graph>
        <p>
          Instances of <b><code>schema:Person</code></b> sorted by <b><code>${props.orderBy} ${props.direction}ending</code></b>
        </p>
        <target-node 
          target-class="schema:Person" 
          order-by="${props.orderBy}"
          order-dir="${props.direction}"
        >
          <vocabulary-table additional-props='["schema:age", "schema:baseSalary", "schema:birthDate"]'>
          </vocabulary-table>
        </target-node>
      </rdf-dataset>
    </rdf-environment> 
  `
}
