import type { Meta, StoryObj } from '@storybook/web-components-vite'
import * as BasicExamples from './BasicExamples.js'

const meta = {
  title: 'Components/data-graph',
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj;

export const BasicExample: Story = {
  render: BasicExamples.ResourceLabel,
}
