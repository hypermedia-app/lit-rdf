import { consume, provide } from '@lit/context'
import { state } from 'lit/decorators.js'
import type { LitElementConstructor } from '../lib/constructor.js'
import type { Environment } from '../context.js'
import { environment as context } from '../context.js'

export function consumeEnvironment<T extends LitElementConstructor>(base: T) {
  class Impl extends base {
    @consume({ context })
    public rdf!: Environment
  }

  return Impl
}

export function provideEnvironment<T extends LitElementConstructor>(base: T) {
  class Impl extends base {
    @state()
    @provide({ context })
    public rdf!: Environment
  }

  return Impl
}
