import { css, html, LitElement, type PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { FocusNode } from '../controllers/FocusNode.js'
import type { MultiPointer } from 'clownface'
import { provide } from '@lit/context'
import { focusNode } from '../context.js'

/**
 * Callback function used to filter clownface graph pointer nodes.
 */
export type FilterCallback = Parameters<MultiPointer['filter']>[0]

/**
 * An element that filters the current focus node(s) in context using a filter callback
 * and provides the filtered pointer to descendant elements.
 *
 * @summary Filters the focus node context.
 * @tag filter-node
 * @slot - Default slot for child elements that consume the filtered focus node context.
 */
@customElement('filter-node')
export default class FilterNode extends LitElement {
  static styles = css`
    :host {
      display: contents !important;
    }
  `

  declare focusNode: FocusNode

  /**
   * The filtered clownface multi-pointer provided to descendant elements.
   */
  @provide({ context: focusNode })
  @state()
  filtered?: MultiPointer

  /**
   * Callback function used to filter the current focus node pointer.
   */
  @property({ attribute: false })
  filter?: FilterCallback

  constructor() {
    super()

    this.focusNode = new FocusNode(this)
    this.focusNode.onChange = () => {
      this.updateFiltered()
    }
  }

  protected willUpdate(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has('filter')) {
      this.updateFiltered()
    }
  }

  private updateFiltered(): void {
    if (this.filter) {
      this.filtered = this.focusNode.pointer?.filter(this.filter)
    }
    else {
      this.filtered = this.focusNode.pointer
    }
  }

  protected render(): unknown {
    return html`
      <slot></slot>`
  }
}
