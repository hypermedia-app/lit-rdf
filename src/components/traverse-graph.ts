import { css, html, LitElement, type PropertyValues } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import type { GraphPointer, MultiPointer } from 'clownface'
import type { ShaclPropertyPath } from 'clownface-shacl-path'
import { findNodes } from 'clownface-shacl-path'
import { provide } from '@lit/context'
import { FocusNode } from '../controllers/FocusNode.js'
import { focusNode as context } from '../context.js'
import { toPropertyPath } from '../converter.js'

/**
 * An element that traverses RDF graph relationships along a property path starting from
 * the current focus node, providing the resolved object nodes in context to child elements
 * or rendering them via template callback functions.
 *
 * @summary Traverses the graph along a property path.
 * @tag traverse-graph
 * @slot - Default slot rendered when object nodes exist and no render template function is provided.
 * @slot empty - Slot rendered when no matching object nodes are found.
 */
@customElement('traverse-graph')
export default class TraverseGraph extends LitElement {
  static styles = css`
        :host {
            display: contents;
        }
    `

  private readonly focusNode: FocusNode

  /**
   * Optional custom template function for rendering each individual resolved graph pointer.
   */
  @property({ type: Object })
  renderObjectNode?: (node: GraphPointer) => unknown

  /**
   * Optional custom template function for rendering all resolved multi-pointer nodes together.
   */
  @property({ type: Object })
  renderObjectNodes?: (nodes: MultiPointer) => unknown

  /**
   * The SHACL property path or predicate URI used to traverse from the focus node.
   */
  @property({ type: Object, converter: toPropertyPath, attribute: 'property-path' })
  propertyPath: ShaclPropertyPath | undefined

  /**
   * The clownface multi-pointer representing the object nodes resolved along the property path.
   */
  @provide({ context })
  @property()
  objectNode: MultiPointer | undefined

  constructor() {
    super()

    this.focusNode = new FocusNode(this)
  }

  render() {
    if (!this.objectNode || this.objectNode.terms.length === 0) {
      return html`<slot name="empty"></slot>`
    }

    if (this.renderObjectNodes) {
      return this.renderObjectNodes(this.objectNode)
    }

    if (this.renderObjectNode) {
      return html`${this.objectNode.map(node => this.renderObjectNode!(node))}`
    }

    return html`<slot></slot>`
  }

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
