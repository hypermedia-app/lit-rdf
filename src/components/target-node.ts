import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { provide } from '@lit/context'
import { provideTargetNode } from '../mixins/targetNode.js'
import { toSortPredicate } from '../converter.js'
import type { SortPredicate } from '../context.js'
import { sortDirection, sortPredicate } from '../context.js'

@customElement('target-node')
export default class extends provideTargetNode(LitElement) {
  static styles = css`
        :host {
            display: contents !important;
        }
    `

  @property({ type: Object, attribute: 'order-by', converter: toSortPredicate })
  @provide({ context: sortPredicate })
  public orderBy: SortPredicate | undefined

  @property({ type: String, attribute: 'order-dir', reflect: true })
  @provide({ context: sortDirection })
  public orderDir: 'asc' | 'desc' = 'asc'

  render() {
    return html`<slot></slot>`
  }
}
