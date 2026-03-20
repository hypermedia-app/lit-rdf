import { css, html, LitElement } from 'lit'
import env from '@zazuko/env/web.js'
import { customElement } from 'lit/decorators.js'
import { provideEnvironment } from '../mixins.js'

@customElement('rdf-environment')
export default class extends provideEnvironment(LitElement) {
  static styles = css`
    :host {
      display: contents;
    }
  `

  constructor() {
    super()

    this.rdf = env
  }

  render() {
    return html`<slot></slot>`
  }
}
