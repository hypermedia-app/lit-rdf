import { consume } from '@lit/context'
import type { MultiPointer } from 'clownface'
import type { LitElementConstructor, WithFocusNode } from '../constructor.js'
import { focusNode as context } from '../context.js'
import { consumeEnvironment } from './environment.js'

export function consumeFocusNode<T extends LitElementConstructor>(base: T) {
  class Impl extends consumeEnvironment(base) {
    constructor(...args: any[]) {
      super(...args)
    }

    @consume({ context, subscribe: true })
      focusNode!: MultiPointer | undefined
  }

  return Impl as T & LitElementConstructor<WithFocusNode>
}
