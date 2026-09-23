import { html } from 'lit'
import './TargetNode.elements.js'
import '../src/components/rdf-environment.js'
import '../src/components/data-graph.js'
import '../src/components/target-node.js'
import '../src/components/filter-node.js'
import type { GraphPointer } from 'clownface'
import $rdf from '@zazuko/env/web.js'

export interface FilteringByAgeProps {
  minAge: number
}

export const FilteringByAge = (props: FilteringByAgeProps) => {
  function filter(ptr: GraphPointer) {
    const age = ptr.out($rdf.ns.foaf.age).value
    return age ? Number(age) >= props.minAge : false
  }

  return html`
    <rdf-environment>
      <data-graph data-graph="example">
        <p>
          Persons with age &ge; <b><code>${props.minAge}</code></b>
        </p>
        <target-node target-class="schema:Person" order-by="foaf:age" order-dir="asc">
          <filter-node id="filter-age" .filter=${filter}>
            <vocabulary-table additional-props='["foaf:age"]'>
            </vocabulary-table>
          </filter-node>
        </target-node>
      </data-graph>
    </rdf-environment>
    <script data-graph="example" type="text/turtle">
      @prefix ex: <http://example.org/> .
      @prefix schema: <http://schema.org/> .
      @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
      @prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
      @prefix foaf: <http://xmlns.com/foaf/0.1/> .
      
      ex:alice a schema:Person ;
        rdfs:label "Alice" ;
        foaf:age 28 .
      
      ex:charlie a schema:Person ;
        rdfs:label "Charlie" ;
        foaf:age 42 .
      
      ex:diana a schema:Person ;
        rdfs:label "Diana" ;
        foaf:age 35 .
      
      ex:edward a schema:Person ;
        rdfs:label "Edward" ;
        foaf:age 19 .
      
      ex:fiona a schema:Person ;
        rdfs:label "Fiona" ;
        foaf:age 23 .
    </script>
  `
}

export interface CustomFilterProps {
  filterType: 'hasBirthDate' | 'highSalary'
}

export const CustomFilter = (props: CustomFilterProps) => {
  function filter(ptr: GraphPointer) {
    if (props.filterType === 'hasBirthDate') {
      return ptr.out($rdf.ns.schema.birthDate).values.length > 0
    }
    const salary = ptr.out($rdf.ns.schema.baseSalary).value
    return salary ? Number(salary) >= 60000 : false
  }

  return html`
    <rdf-environment>
      <data-graph data-graph="example">
        <p>
          Filtered by: <b><code>${props.filterType}</code></b>
        </p>
        <target-node target-class="schema:Person" order-by="rdfs:label">
          <filter-node id="custom-filter" .filter=${filter}>
            <vocabulary-table additional-props='["foaf:age", "schema:baseSalary", "schema:birthDate"]'>
            </vocabulary-table>
          </filter-node>
        </target-node>
      </data-graph>
    </rdf-environment>    
    <script data-graph="example" type="text/turtle">
      @prefix ex: <http://example.org/> .
      @prefix schema: <http://schema.org/> .
      @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
      @prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
      @prefix foaf: <http://xmlns.com/foaf/0.1/> .
      
      ex:alice a schema:Person ;
        rdfs:label "Alice" ;
        foaf:age 28 ;
        schema:baseSalary 55000.50 .
      
      ex:bob a schema:Person ;
        rdfs:label "Bob" ;
        schema:baseSalary 72000.00 ;
        schema:birthDate "1985-03-15T10:30:00Z"^^xsd:dateTime .
      
      ex:charlie a schema:Person ;
        rdfs:label "Charlie" ;
        foaf:age 42 ;
        schema:birthDate "1981-08-22T14:00:00Z"^^xsd:dateTime .
      
      ex:diana a schema:Person ;
        rdfs:label "Diana" ;
        foaf:age 35 ;
        schema:baseSalary 63000.75 .
      
      ex:edward a schema:Person ;
        rdfs:label "Edward" ;
        foaf:age 19 ;
        schema:baseSalary 48000.25 ;
        schema:birthDate "1998-12-05T08:15:00Z"^^xsd:dateTime .
      
      ex:fiona a schema:Person ;
        rdfs:label "Fiona" ;
        foaf:age 23 ;
        schema:birthDate "2000-07-19T18:45:00Z"^^xsd:dateTime .
    </script>
  `
}
