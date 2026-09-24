import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { provide } from '@lit/context'
import { provideTargetNode } from '../mixins/targetNode.js'
import { toSortPredicate } from '../converter.js'
import type { SortPredicate } from '../context.js'
import { sortDirection, sortPredicate } from '../context.js'

/**
 * An element that selects focus nodes from the RDF graph based on criteria such as
 * target node URI, target class, subjects of a predicate, or objects of a predicate,
 * with optional sorting support.
 *
 * @summary Selects and provides focus nodes from the RDF graph.
 * @tag target-node
 * @slot - Default slot for child elements consuming the targeted focus nodes.
 */
@customElement('target-node')
export default class TargetNode extends provideTargetNode(LitElement) {
  static styles = css`
        :host {
            display: contents !important;
        }
    `

  /**
   * Sort predicate or property URI used to order targeted nodes.
   */
  @property({ type: Object, attribute: 'order-by', converter: toSortPredicate })
  @provide({ context: sortPredicate })
  public orderBy: SortPredicate | undefined

  /**
   * Sort direction ('asc' for ascending, 'desc' for descending).
   * @default 'asc'
   */
  @property({ type: String, attribute: 'order-dir', reflect: true })
  @provide({ context: sortDirection })
  public orderDir: 'asc' | 'desc' = 'asc'

  render() {
    return html`<slot></slot>`
  }
}
