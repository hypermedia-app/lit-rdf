import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { expect, waitFor } from 'storybook/test'
import type { DatasetCore } from '@rdfjs/types'
import * as Examples from './RdfDataset.examples.js'
import type { PrintDataset } from './RdfDataset.elements.js'
import type { GraphProps } from './common.js'

const meta = {
  title: 'rdf-dataset',
  tags: ['autodocs'],
} satisfies Meta

export default meta

export const DefaultGraph: StoryObj<GraphProps<'1' | '2'>> = {
  render: Examples.DatasetFromMultipleDefaultGraphSources,
  args: {
    graph1: `
      prefix ex: <http://example.com/>
      ex:foo ex:from "graph1" .
    `,
    graph2: `
      prefix ex: <http://example.com/>
      ex:bar ex:from "graph2" .
    `,
  },
  play: async ({ canvasElement: canvas, step }) => {
    const dataset = canvas.querySelector<PrintDataset>('print-dataset')!

    await step('Initial has combined triples', async () => {
      await waitFor(() => {
        expect(dataset.datasetController.value).toHaveProperty('size', 2)
      })
    })

    const graph = canvas.querySelector('rdf-graph')!
    await step('Remove rdf-graph element from rdf-dataset', async () => {
      graph.remove()
      await waitFor(() => {
        expect(dataset.datasetController.value).toHaveProperty('size', 1)
      })
    })

    await step('Re-add rdf-graph to rdf-dataset', async () => {
      dataset.append(graph)
      await waitFor(() => {
        expect(dataset.datasetController.value).toHaveProperty('size', 2)
      })
    })
  },
}

export const NamedGraphs: StoryObj<GraphProps<'1' | '2'>> = {
  render: Examples.DatasetWithNamedGraphs,
  args: {
    graph1: `
      prefix ex: <http://example.com/>
      ex:foo ex:from "graph1" .
    `,
    graph2: `
      prefix ex: <http://example.com/>
      ex:bar ex:from "graph2" .
    `,
  },
  play: async ({ canvasElement: canvas, step }) => {
    const dataset = canvas.querySelector<PrintDataset>('print-dataset')!

    function getGraphs(dataset: DatasetCore | undefined) {
      if (dataset) {
        return [...[...dataset].reduce((acc, quad) => {
          acc.add(quad.graph.value)
          return acc
        }, new Set())]
      }

      return []
    }

    await step('Initial has combined triples', async () => {
      await waitFor(() => {
        expect(getGraphs(dataset.datasetController.value)).toEqual([
          'http://example.com/graph1',
          'http://example.com/graph2',
        ])
      })
    })

    const graph = canvas.querySelector('rdf-graph[graph="http://example.com/graph2"]')!
    await step('Remove rdf-graph element from rdf-dataset', async () => {
      graph.remove()
      await waitFor(() => {
        expect(getGraphs(dataset.datasetController.value)).toEqual([
          'http://example.com/graph1',
        ])
      })
    })

    await step('Re-add rdf-graph to rdf-dataset', async () => {
      dataset.append(graph)
      await waitFor(() => {
        expect(getGraphs(dataset.datasetController.value)).toEqual([
          'http://example.com/graph1',
          'http://example.com/graph2',
        ])
      })
    })
  },
}
