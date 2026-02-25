import type { AnyPointer } from 'clownface'
import { consume, provide } from '@lit/context'
import { state } from 'lit/decorators.js'
import { dataset } from '../context.js'
import type { LitElementConstructor } from '../lib/constructor.js'

export function provideGraph<T extends LitElementConstructor>(base: T) {
  class WithGraphProvider extends base {
    constructor(...args: any[]) {
      super(...args)
    }

    @provide({ context: dataset })
    @state()
    public graph: AnyPointer | undefined
  }

  return WithGraphProvider
}

export function consumeGraph<T extends LitElementConstructor>(base: T) {
  class WithGraphConsumer extends base {
    constructor(...args: any[]) {
      super(...args)
    }

    @consume({ context: dataset, subscribe: true })
    @state()
    public graph: AnyPointer | undefined
  }

  return WithGraphConsumer
}
