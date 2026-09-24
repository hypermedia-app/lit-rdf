import { html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import type { NamedNode } from '@rdfjs/types'
import { findNodes } from 'clownface-shacl-path'
import { toPropertyPath } from '../converter.js'
import { FocusNode } from '../controllers/FocusNode.js'

/**
 * An element that renders an HTML anchor (`<a>`) tag linking to a resource URI or
 * a property path value extracted from the current focus node.
 *
 * @summary Renders an HTML anchor link for the focus node or property.
 * @tag resource-link
 * @slot - Content to display inside the link.
 */
@customElement('resource-link')
export class ResourceLink extends LitElement {
  /**
   * Optional property path or predicate whose resolved node value will be used as the link `href`.
   * If omitted, the focus node's own URI is used as the link target.
   */
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
