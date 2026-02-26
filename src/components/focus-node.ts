import { css, html, LitElement } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { provide } from '@lit/context'
import type { MultiPointer } from 'clownface'
import { focusNode as context } from '../context.js'

@customElement('focus-node')
export default class extends LitElement {
  static styles = css`
        :host {
            display: contents !important;
        }
    `

  @provide({ context })
  @state()
  public focusNode: MultiPointer | undefined

  render() {
    return html`<slot></slot>`
  }
}
