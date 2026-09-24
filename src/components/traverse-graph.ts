import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import type { GraphPointer, MultiPointer } from 'clownface'
import { traverseGraph } from '../mixins/traverseGraph.js'

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
export default class TraverseGraph extends traverseGraph(LitElement) {
  static styles = css`
        :host {
            display: contents;
        }
    `

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
}
