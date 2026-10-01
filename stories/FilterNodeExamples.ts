import { html } from 'lit'
import './TargetNode.elements.js'
import '../src/components/rdf-environment.js'
import '../src/components/rdf-dataset.js'
import '../src/components/rdf-graph.js'
import '../src/components/target-node.js'
import '../src/components/filter-node.js'
import type { GraphPointer } from 'clownface'
import $rdf from '@zazuko/env/web.js'
import type { StoryFn } from '@storybook/web-components-vite'
import type { GraphProps } from './common.js'

export interface FilteringByAgeProps extends GraphProps {
  minAge: number
}

export const FilteringByAge: StoryFn<FilteringByAgeProps> = (props, { loaded }) => {
  function filter(ptr: GraphPointer) {
    const age = ptr.out($rdf.ns.foaf.age).value
    return age ? Number(age) >= props.minAge : false
  }

  return html`
    <rdf-environment>
      <rdf-dataset>
        <rdf-graph .value="${loaded.graph}"></rdf-graph>
        <p>
          Persons with age &ge; <b><code>${props.minAge}</code></b>
        </p>
        <target-node target-class="schema:Person" order-by="foaf:age" order-dir="asc">
          <filter-node id="filter-age" .filter=${filter}>
            <vocabulary-table additional-props='["foaf:age"]'>
            </vocabulary-table>
          </filter-node>
        </target-node>
      </rdf-dataset>
    </rdf-environment>
  `
}

export interface CustomFilterProps extends GraphProps {
  filterType: 'hasBirthDate' | 'highSalary'
}

export const CustomFilter: StoryFn<CustomFilterProps> = (props, { loaded }) => {
  function filter(ptr: GraphPointer) {
    if (props.filterType === 'hasBirthDate') {
      return ptr.out($rdf.ns.schema.birthDate).values.length > 0
    }
    const salary = ptr.out($rdf.ns.schema.baseSalary).value
    return salary ? Number(salary) >= 60000 : false
  }

  return html`
    <rdf-environment>
      <rdf-dataset>
        <rdf-graph .value="${loaded.graph}"></rdf-graph>
        <p>
          Filtered by: <b><code>${props.filterType}</code></b>
        </p>
        <target-node target-class="schema:Person" order-by="rdfs:label">
          <filter-node id="custom-filter" .filter=${filter}>
            <vocabulary-table additional-props='["foaf:age", "schema:baseSalary", "schema:birthDate"]'>
            </vocabulary-table>
          </filter-node>
        </target-node>
      </rdf-dataset>
    </rdf-environment>
  `
}
