import { html } from 'lit'
import '../src/components/rdf-dataset.js'
import '../src/components/rdf-graph.js'
import '../src/components/target-node.js'
import '../src/components/resource-label.js'
import '../src/components/rdf-environment.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import type { StoryFn } from '@storybook/web-components-vite'
import type { GraphProps } from './common.js'

export interface ResourceLabelProps extends GraphProps {
  labelProp?: string
  targetNode?: string
}

export const ResourceLabel: StoryFn<ResourceLabelProps> = ({ labelProp, targetNode = 'http://example.com/foo' }, { loaded }) => {
  return html`
    <rdf-environment>
      <rdf-dataset>
        <rdf-graph .value="${loaded.graph}">
        </rdf-graph>
        <target-node target-node="${targetNode}">
          <resource-label predicate="${ifDefined(labelProp)}"></resource-label>
        </target-node>
      </rdf-dataset>
    </rdf-environment>
  `
}
