import { property } from 'lit/decorators.js'
import type { ShaclPropertyPath } from 'clownface-shacl-path'
import { findNodes } from 'clownface-shacl-path'
import type { MultiPointer } from 'clownface'
import { provide } from '@lit/context'
import type { PropertyValues } from 'lit'
import { focusNode as context } from '../context.js'
import { toPropertyPath } from '../lib/converter.js'
import type { LitElementConstructor } from '../lib/constructor.js'
import { consumeFocusNode } from './focusNode.js'

export function traverseGraph<T extends LitElementConstructor>(Base: T) {
  class TraverseGraph extends consumeFocusNode(Base) {
    constructor(...args: any[]) {
      super(...args)
    }

    @property({ type: Object, converter: toPropertyPath, attribute: 'property-path' })
      propertyPath: ShaclPropertyPath | undefined

    @provide({ context })
    @property()
      objectNode: MultiPointer | undefined

    willUpdate(_changedProperties: PropertyValues) {
      if (_changedProperties.has('focusNode') || _changedProperties.has('propertyPath')) {
        this.setObjectNode()
      }
    }

    setObjectNode() {
      if (this.propertyPath && this.focusNode) {
        this.objectNode = findNodes(this.focusNode, this.propertyPath)
      }
    }
  }

  return TraverseGraph
}
