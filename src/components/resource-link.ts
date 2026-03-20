import { html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import type { NamedNode } from '@rdfjs/types'
import { findNodes } from 'clownface-shacl-path'
import { toPropertyPath } from '../converter.js'
import { FocusNode } from '../controllers/FocusNode.js'

@customElement('resource-link')
export class ResourceLink extends LitElement {
  @property({ type: Object, converter: toPropertyPath })
  public property?: NamedNode

  private readonly focusNode: FocusNode

  constructor() {
    super()

    this.focusNode = new FocusNode(this)
  }

  render() {
    if (!this.focusNode.pointer) {
      return html`
                <slot></slot>`
    }

    let href

    if (this.property) {
      href = findNodes(this.focusNode.pointer, this.property).value
    }

    if (!href) {
      href = this.focusNode.pointer.value
    }

    return html`<a href="${href}">
            <slot></slot>
        </a>`
  }
}
