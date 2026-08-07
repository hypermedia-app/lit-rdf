import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { expect, waitFor } from 'storybook/test'
import type TargetNode from '../src/components/target-node.js'
import * as Examples from './TargetNodeExamples.js'
import type { SortingTargetNodesProps, SortOrderProps } from './TargetNodeExamples.js'

/**
 * In the examples below, `<target-node>` is used to display a list of nodes from the RDFS vocabulary.
 * Check the `<vocabulary-table>` component for more information on how the focus nodes are consumed.
 */
const meta = {
  title: 'Target Node',
  tags: ['autodocs'],
} satisfies Meta

export default meta

/**
 * Sorting a list of RDFS resources rendered by `<target-node>`.
 *
 * What this story shows
 * - Displays focus nodes for a selected `targetClass`.
 * - Allows changing the sort key via `orderBy`.
 */
export const SortingTargetNodes: StoryObj<SortingTargetNodesProps> = {
  args: {
    targetClass: 'rdf:Property',
    orderBy: 'rdfs:label',
  },
  argTypes: {
    targetClass: {
      options: ['rdf:Property', 'rdfs:Class'],
      control: 'radio',
    },
    orderBy: {
      options: ['rdfs:label', 'rdfs:comment'],
      control: 'radio',
    },
  },
  render: Examples.SortingTargetNodes,
  async play({ canvasElement, step }) {
    const targetNode = canvasElement.querySelector<TargetNode>('target-node')!

    await step('Initial value', async () => {
      const thirdRowFirstCell = await waitFor(() => getInspectedCell(targetNode, { row: 3 }))

      await waitFor(() => {
        expect(thirdRowFirstCell).toHaveTextContent('rdfs:isDefinedBy')
      })
    })

    await step('Sort by comment', async () => {
      targetNode.setAttribute('order-by', 'rdfs:comment')

      const thirdRowFirstCell = await waitFor(() => getInspectedCell(targetNode, { row: 3 }))

      await waitFor(() => {
        expect(thirdRowFirstCell).toHaveTextContent('rdfs:label')
      })
    })
  },
}

/**
 * Custom sorting of target nodes rendered by `<target-node>`.
 *
 * To set a custom comparator, set the `orderBy` property of `<target-node>`.
 * Its signature must be `(node: GraphPointer) => string`.
 */
export const CustomSortingTargetNodes: StoryObj<SortingTargetNodesProps> = {
  args: {
    targetClass: 'rdf:Property',
  },
  argTypes: {
    targetClass: {
      options: ['rdf:Property', 'rdfs:Class'],
      control: 'radio',
    },
  },
  render: Examples.CustomSortingTargetNodes,
  async play({ canvasElement, step }) {
    const targetNode = canvasElement.querySelector<TargetNode>('target-node')!

    await step('Initial value', async () => {
      const thirdRowFirstCell = await waitFor(() => getInspectedCell(targetNode, { row: 3 }))

      await waitFor(() => {
        expect(thirdRowFirstCell).toHaveTextContent('rdfs:isDefinedBy')
      })
    })

    await step('Switch to classes', async () => {
      targetNode.setAttribute('target-class', 'rdfs:Class')

      const thirdRowFirstCell = await waitFor(() => getInspectedCell(targetNode, { row: 2 }))

      await waitFor(() => {
        expect(thirdRowFirstCell).toHaveTextContent('rdfs:Container')
      })
    })
  },
}

/**
 * Changing sort direction of target nodes rendered by `<target-node>`.
 *
 * Set the `order-dir` attribute or `orderDir` property to change the sort direction.
 */
export const SortOrder: StoryObj<SortOrderProps> = {
  args: {
    direction: 'asc',
  },
  argTypes: {
    direction: {
      options: ['asc', 'desc'],
      control: 'radio',
    },
  },
  render: Examples.SortOrderOfTargetNodes,
  async play({ canvasElement, step }) {
    const targetNode = canvasElement.querySelector<TargetNode>('target-node')!

    await step('Initial value', async () => {
      const thirdRowFirstCell = await waitFor(() => getInspectedCell(targetNode))

      await waitFor(() => {
        expect(thirdRowFirstCell).toHaveTextContent('rdfs:comment')
      })
    })

    await step('Order descending', async () => {
      targetNode.setAttribute('order-dir', 'desc')

      const thirdRowFirstCell = await waitFor(() => getInspectedCell(targetNode))

      await waitFor(() => {
        expect(thirdRowFirstCell).toHaveTextContent('rdfs:subPropertyOf')
      })
    })
  },
}

function getInspectedCell(targetNode: Element, { row = 1, column = 1 }: { row?: number, column?: number } = {}) {
  return new Promise<Element>((resolve) => {
    const interval = setInterval(() => {
      const el = targetNode
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
