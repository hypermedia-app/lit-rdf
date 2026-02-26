import type { Meta, StoryObj } from '@storybook/web-components-vite'
import * as BasicExamples from './BasicExamples.js'

const meta = {
  title: 'Components/data-graph',
  tags: ['autodocs'],
} satisfies Meta

export default meta

export const BasicExample: StoryObj<{ labelProp: string }> = {
  render: BasicExamples.ResourceLabel,
  args: {
    labelProp: 'rdfs:label',
  },
}
