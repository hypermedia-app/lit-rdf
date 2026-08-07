import { provide } from '@lit/context'
import { state } from 'lit/decorators.js'
import type { LitElementConstructor, WithEnvironment } from '../constructor.js'
import type { Environment } from '../context.js'
import { environment as context } from '../context.js'

export function provideEnvironment<T extends LitElementConstructor>(base: T) {
  class Impl extends base {
    @state()
    @provide({ context })
    public rdf!: Environment
  }

  return Impl as T & LitElementConstructor<WithEnvironment>
}
