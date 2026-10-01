import type { Preview } from '@storybook/web-components-vite'
import type { DatasetCore, Quad } from '@rdfjs/types'
import type { ArgTypesEnhancer } from 'storybook/internal/types'
import { loadGraphData } from './load-graph.js'

declare module '@rdfjs/types' {
  interface Stream extends AsyncGenerator<Quad> {}
}

const preview: Preview = {
  parameters: {
    docs: {
      canvas: {
        sourceState: 'shown',
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  loaders: [
    async ({ args }: Record<string, any>) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      const loadPromises = Object.entries(args)
        .filter(([name]) => name.startsWith('graph'))
        .map(async ([name, source]) => {
          const dataset = await loadGraphData(source as string | URL)
          return [name, dataset] as [string, DatasetCore]
        })

      return Object.fromEntries(await Promise.all(loadPromises))
    },
  ],
}

export const argTypesEnhancers: ArgTypesEnhancer[] = [
  (context) => {
    const processedArgTypes = { ...context.argTypes }

    const namedArgs = Object.keys(processedArgTypes)
    const actualArgs = Object.keys(context.initialArgs || {});

    // 2. Scan only the real properties that exist on this component
    [...namedArgs, ...actualArgs].forEach((key) => {
      if (key.startsWith('graph')) {
        processedArgTypes[key] = {
          type: { name: 'string' },
          ...processedArgTypes[key],
          control: { type: 'text' },
          table: {
            ...processedArgTypes[key]?.table,
            category: 'Graph Data', // Safely isolate into the group
          },
        }
      }
    })

    return processedArgTypes
  },
]

export default preview
