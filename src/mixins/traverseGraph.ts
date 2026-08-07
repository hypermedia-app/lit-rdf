import { property } from 'lit/decorators.js'
import type { ShaclPropertyPath } from 'clownface-shacl-path'
import { findNodes } from 'clownface-shacl-path'
import type { MultiPointer } from 'clownface'
import { provide } from '@lit/context'
import type { PropertyValues } from 'lit'
import { focusNode as context } from '../context.js'
import { toPropertyPath } from '../converter.js'
import type { LitElementConstructor } from '../constructor.js'
import { FocusNode } from '../controllers/FocusNode.js'

export function traverseGraph<T extends LitElementConstructor>(Base: T) {
  class TraverseGraph extends Base {
    private readonly focusNode: FocusNode

    constructor(...args: any[]) {
      super(...args)

      this.focusNode = new FocusNode(this)
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
      if (this.propertyPath && this.focusNode.pointer) {
        this.objectNode = findNodes(this.focusNode.pointer, this.propertyPath)
      }
    }
  }

  return TraverseGraph as T & LitElementConstructor<{ objectNode: MultiPointer | undefined }>
}
