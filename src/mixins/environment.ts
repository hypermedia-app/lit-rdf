import { provide } from '@lit/context'
import { state } from 'lit/decorators.js'
import type { LitElementConstructor, WithEnvironment } from '../constructor.js'
import type { Environment } from '../context.js'
import { environment as context } from '../context.js'

/**
 * Mixin that adds RDF environment providing capabilities to a Lit element.
 * Exposes an `rdf` environment property and provides it to child components via the `environment` context.
 *
 * @param base Base LitElement constructor class
 * @returns Enhanced class providing environment context
 */
export function provideEnvironment<T extends LitElementConstructor>(base: T) {
  class Impl extends base {
    @state()
    @provide({ context })
    public rdf!: Environment
  }

  return Impl as T & LitElementConstructor<WithEnvironment>
}
