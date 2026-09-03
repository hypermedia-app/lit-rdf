import { provide } from '@lit/context'
import { state } from 'lit/decorators.js'
import { dataset as context } from '../context.js'
import type { LitElementConstructor, WithDataset } from '../constructor.js'
import type { DatasetCore } from '@rdfjs/types'

export function provideDataset<T extends LitElementConstructor>(base: T) {
  class WithDatasetProvider extends base {
    @provide({ context })
    @state()
    public datasets: DatasetCore[] = []
  }

  return WithDatasetProvider as T & LitElementConstructor<WithDataset>
}
