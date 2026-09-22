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

export interface SortingLiteralsProps {
  orderBy: 'schema:age' | 'schema:baseSalary' | 'schema:birthDate'
  direction: 'asc' | 'desc'
}

export const SortingLiterals = (props: SortingLiteralsProps) => {
  return html`
    <rdf-environment>
      <data-graph data-graph="example">
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
      </data-graph>
    </rdf-environment> 
    <script data-graph="example" type="text/turtle">
      @prefix ex: <http://example.org/> .
      @prefix schema: <http://schema.org/> .
      @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
      @prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
      
      ex:alice a schema:Person ;
        rdfs:label "Alice" ;
        schema:age 28 ;
        schema:baseSalary 55000.50 .
      
      ex:bob a schema:Person ;
        rdfs:label "Bob" ;
        schema:baseSalary 72000.00 ;
        schema:birthDate "1985-03-15T10:30:00Z"^^xsd:dateTime .
      
      ex:charlie a schema:Person ;
        rdfs:label "Charlie" ;
        schema:age 42 ;
        schema:birthDate "1981-08-22T14:00:00Z"^^xsd:dateTime .
      
      ex:diana a schema:Person ;
        rdfs:label "Diana" ;
        schema:age 35 ;
        schema:baseSalary 63000.75 .
      
      ex:edward a schema:Person ;
        rdfs:label "Edward" ;
        schema:baseSalary 48000.25 ;
        schema:birthDate "1998-12-05T08:15:00Z"^^xsd:dateTime .
      
      ex:fiona a schema:Person ;
        rdfs:label "Fiona" ;
        schema:age 23 ;
        schema:birthDate "2000-07-19T18:45:00Z"^^xsd:dateTime .
    </script>
  `
}
