import type { AnyPointer } from 'clownface'
import { provide } from '@lit/context'
import { state } from 'lit/decorators.js'
import { dataset } from '../context.js'
import type { LitElementConstructor, WithGraph } from '../constructor.js'

/**
 * Mixin that adds graph dataset providing capabilities to a Lit element.
 * Exposes a `graph` property and provides it to child components via the `dataset` context.
 *
 * @param base Base LitElement constructor class
 * @returns Enhanced class providing graph context
 */
export function provideGraph<T extends LitElementConstructor>(base: T) {
  class WithGraphProvider extends base {
    @provide({ context: dataset })
    @state()
    public graph: AnyPointer | undefined
  }

  return WithGraphProvider as T & LitElementConstructor<WithGraph>
}
