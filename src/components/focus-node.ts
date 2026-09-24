import { css, html, LitElement } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { provide } from '@lit/context'
import type { MultiPointer } from 'clownface'
import { focusNode as context } from '../context.js'

/**
 * An element that sets or provides a clownface focus node in the context for child elements.
 *
 * @summary Sets or provides a clownface focus node context.
 * @tag focus-node
 * @slot - Default slot for child elements that consume the focus node context.
 */
@customElement('focus-node')
export default class FocusNode extends LitElement {
  static styles = css`
        :host {
            display: contents !important;
        }
    `

  /**
   * The clownface multi-pointer representing the current focus node(s) provided to child elements.
   */
  @provide({ context })
  @state()
  public focusNode: MultiPointer | undefined

  render() {
    return html`<slot></slot>`
  }
}
