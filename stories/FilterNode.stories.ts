import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { expect, waitFor } from 'storybook/test'
import $rdf from '@zazuko/env/web.js'
import type { GraphPointer } from 'clownface'
import type FilterNode from '../src/components/filter-node.js'
import * as Examples from './FilterNodeExamples.js'
import type { CustomFilterProps, FilteringByAgeProps } from './FilterNodeExamples.js'

/**
 * `<filter-node>` filters the current focus nodes using a clownface filter callback
 * and provides the filtered nodes to its child elements.
 */
const meta = {
  title: 'Filter Node',
  tags: ['autodocs'],
} satisfies Meta

export default meta

/**
 * Filtering a list of resources by a property condition.
 *
 * In this example, `<filter-node>` is used within `<target-node>` to only display persons whose `schema:age` is greater than or equal to `minAge`.
 */
export const FilteringByAge: StoryObj<FilteringByAgeProps> = {
  args: {
    minAge: 30,
    graph: `
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
      `,
  },
  argTypes: {
    minAge: {
      control: 'number',
      description: 'Minimum age of persons to include',
    },
  },
  render: Examples.FilteringByAge,
  async play({ canvasElement, step }) {
    const filterNode = canvasElement.querySelector<FilterNode>('filter-node')!

    await step('Initial filtered items (age >= 30)', async () => {
      const firstRow = await waitFor(() => getInspectedCell(filterNode, { row: 1 }))
      await waitFor(() => {
        expect(firstRow).toHaveTextContent('http://example.org/diana')
      })

      const secondRow = await waitFor(() => getInspectedCell(filterNode, { row: 2 }))
      await waitFor(() => {
        expect(secondRow).toHaveTextContent('http://example.org/charlie')
      })
    })

    await step('Update filter to age >= 40', async () => {
      filterNode.filter = (ptr: GraphPointer) => {
        const age = ptr.out($rdf.ns.foaf.age).value
        return age ? Number(age) >= 40 : false
      }

      const firstRow = await waitFor(() => getInspectedCell(filterNode, { row: 1 }))
      await waitFor(() => {
        expect(firstRow).toHaveTextContent('http://example.org/charlie')
      })
    })
  },
}

/**
 * Filtering resources using custom clownface pointer filter callbacks.
 *
 * You can pass any `FilterCallback` to the `.filter` property of `<filter-node>`.
 */
export const CustomFilter: StoryObj<CustomFilterProps> = {
  args: {
    filterType: 'hasBirthDate',
    graph: `
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
  schema:birthDate "2000-07-19T18:45:00Z"^^xsd:dateTime .`,
  },
  argTypes: {
    filterType: {
      options: ['hasBirthDate', 'highSalary'],
      control: 'radio',
    },
  },
  render: Examples.CustomFilter,
  async play({ canvasElement, step }) {
    const filterNode = canvasElement.querySelector<FilterNode>('filter-node')!

    await step('Filter by birth date', async () => {
      const firstRow = await waitFor(() => getInspectedCell(filterNode, { row: 1 }))
      await waitFor(() => {
        expect(firstRow).toHaveTextContent('http://example.org/bob')
      })
    })

    await step('Filter by salary', async () => {
      filterNode.filter = (ptr: GraphPointer) => {
        const salary = ptr.out($rdf.ns.schema.baseSalary).value
        return salary ? Number(salary) >= 60000 : false
      }

      const firstRow = await waitFor(() => getInspectedCell(filterNode, { row: 1 }))
      await waitFor(() => {
        expect(firstRow).toHaveTextContent('http://example.org/bob')
      })

      const secondRow = await waitFor(() => getInspectedCell(filterNode, { row: 2 }))
      await waitFor(() => {
        expect(secondRow).toHaveTextContent('http://example.org/diana')
      })
    })

    await step('Filter removed', async () => {
      filterNode.filter = undefined

      await waitFor(() => {
        const rows = filterNode
          ?.querySelector('vocabulary-table')
          ?.shadowRoot
          ?.querySelectorAll('table tbody tr')

        expect(rows).toHaveLength(6)
      })
    })
  },
}

function getInspectedCell(filterNode: Element, { row = 1, column = 1 }: { row?: number, column?: number } = {}) {
  return new Promise<Element>((resolve) => {
    const interval = setInterval(() => {
      const el = filterNode
        ?.querySelector('vocabulary-table')
        ?.shadowRoot
        ?.querySelector(`table tbody tr:nth-child(${row}) td:nth-child(${column})`)

      if (el) {
        resolve(el)
        clearInterval(interval)
      }
    }, 50)
  })
}
