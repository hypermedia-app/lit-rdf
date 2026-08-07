import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { expect, waitFor } from 'storybook/test' // eslint-disable-line import/no-unresolved
import $rdf from '@zazuko/env/web.js'
import type { ResourceLabel } from '../src/components/resource-label.js'
import type TargetNode from '../src/components/target-node.js'
import * as BasicExamples from './BasicExamples.js'
import type { ResourceLabelProps } from './BasicExamples.js'

const meta = {
  title: 'Getting started',
  tags: ['autodocs'],
} satisfies Meta

export default meta

/**
 * This example shows how to use the `<resource-label>` component which displays the value of a given property.
 *
 * 1. `<rdf-environment>` provides the default environment from [@zazuko/env/web.js](https://npm.im/@zazuko/env).
 * 2. The `<data-graph>` holds the RDF/JS dataset which can be requested by child DOM elements.
 * 3. `<target-node>` element does that and sets the focus node for its children. In this case, the focus node is the node with IRI `http://example.com/node`.
 * 4. Finally, the `<resource-label>` component displays the value of the property specified by the `predicate` attribute (and JS property, if accessed imperatively).
 *
 * Note that the predicate can be a prefixed name from any vocabulary known to [@zazuko/prefixes](https://github.com/zazuko/rdf-vocabularies). Try changing the predicate to `skos:prefLabel`.
 */
export const NodeLabel: StoryObj<ResourceLabelProps> = {
  render: BasicExamples.ResourceLabel,
  args: {
    targetNode: 'http://example.com/foo',
    labelProp: 'skos:prefLabel',
  },
  parameters: {
    docs: {
      canvas: {
        sourceState: 'shown',
      },
    },
  },
  argTypes: {
    targetNode: {
      control: 'radio',
      options: ['http://example.com/foo', 'http://example.com/bar'],
      description: 'Corresponds to the `target-node` attribute of `<target-node>`',
    },
    labelProp: {
      control: 'radio',
      options: ['skos:prefLabel', 'rdfs:label'],
      description: 'Corresponds to the `predicate` attribute of `<resource-label>`',
      table: {
        defaultValue: {
          summary: 'rdfs:label',
        },
      },
    },
  },
  async play({ canvasElement, step }) {
    const resourceLabel = canvasElement.querySelector('resource-label') as ResourceLabel

    await step('Initial value', async () => {
      await waitFor(() => {
        expect(resourceLabel?.shadowRoot).toHaveTextContent('The Foo')
      })
    })

    await step('Predicate changed by property', async () => {
      resourceLabel.predicate = $rdf.ns.rdfs.label
      await resourceLabel.updateComplete
      expect(resourceLabel?.shadowRoot).toHaveTextContent('Example node')
    })

    await step('Predicate changed by attribute', async () => {
      resourceLabel.setAttribute('predicate', 'skos:prefLabel')
      await resourceLabel.updateComplete
      expect(resourceLabel?.shadowRoot).toHaveTextContent('The Foo')
    })

    await step('Target changed', async () => {
      const targetNode = canvasElement.querySelector('target-node') as TargetNode
      targetNode.targetNode = $rdf.namedNode('http://example.com/bar')
      await waitFor(() => {
        expect(resourceLabel?.shadowRoot).toHaveTextContent('The Bar')
      })
    })
  },
}
