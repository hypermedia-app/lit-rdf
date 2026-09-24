import { css, html, LitElement } from 'lit'
import env from '@zazuko/env/web.js'
import { customElement } from 'lit/decorators.js'
import { provideEnvironment } from '../mixins.js'

/**
 * An element that provides an RDF/JS environment in the context for all downstream elements.
 *
 * @summary Provides an RDF/JS environment in context.
 * @tag rdf-environment
 * @slot - Default slot for child elements that consume the RDF environment.
 */
@customElement('rdf-environment')
export default class RdfEnvironment extends provideEnvironment(LitElement) {
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
