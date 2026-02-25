import type { LitElement } from 'lit'
import type { AnyPointer } from 'clownface'
import { consume, provide } from '@lit/context'
import { state } from 'lit/decorators.js'
import { dataset } from '../context.js'
import type { Constructor } from '../lib/constructor.js'

export function provideGraph<T extends LitElement>(base: Constructor<T>) {
  class WithGraphProvider extends base {
    @provide({ context: dataset })
    @state()
    public graph: AnyPointer | undefined
  }

  return WithGraphProvider
}

export function consumeGraph<T extends LitElement>(base: Constructor<T>) {
  class WithGraphConsumer extends base {
    @consume({ context: dataset, subscribe: true })
    @state()
    public graph: AnyPointer | undefined
  }

  return WithGraphConsumer
}
