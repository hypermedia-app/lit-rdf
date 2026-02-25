import { html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import type { NamedNode } from '@rdfjs/types'
import { findNodes } from 'clownface-shacl-path'
import { consumeFocusNode } from '../mixins/focusNode.js'
import { toPropertyPath } from '../lib/converter.js'

@customElement('resource-link')
export class ResourceLink extends consumeFocusNode(LitElement) {
  @property({ type: Object, converter: toPropertyPath })
    property?: NamedNode

  render() {
    if (!this.focusNode) {
      return html`
                <slot></slot>`
    }

    let href

    if (this.property) {
      href = findNodes(this.focusNode, this.property).value
    }

    if (!href) {
      href = this.focusNode.value
    }

    return html`<a href="${href}">
            <slot></slot>
        </a>`
  }
}
