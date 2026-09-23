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

    await step('Filter by hasBirthDate', async () => {
      const firstRow = await waitFor(() => getInspectedCell(filterNode, { row: 1 }))
      await waitFor(() => {
        expect(firstRow).toHaveTextContent('http://example.org/bob')
      })
    })

    await step('Filter by highSalary', async () => {
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
