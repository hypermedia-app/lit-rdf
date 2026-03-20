import type { AnyPointer } from 'clownface'
import { provide } from '@lit/context'
import { state } from 'lit/decorators.js'
import { dataset } from '../context.js'
import type { LitElementConstructor, WithGraph } from '../constructor.js'

export function provideGraph<T extends LitElementConstructor>(base: T) {
  class WithGraphProvider extends base {
    constructor(...args: any[]) {
      super(...args)
    }

    @provide({ context: dataset })
    @state()
    public graph: AnyPointer | undefined
  }

  return WithGraphProvider as T & LitElementConstructor<WithGraph>
}
