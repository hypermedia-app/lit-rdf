import { css, html, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'
import { getDefaultEnvironment } from '../default-environment.js'
import type { Environment } from '../environment.js'
import { provideEnvironment } from '../mixins/environment.js'

declare global {
  interface HTMLRdfEnvironmentElement {
    /** The RDF/JS environment instance provided in context to descendant elements. */
    rdf: Environment
  }
}

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
    this.rdf = getDefaultEnvironment()
  }

  render() {
    return html`<slot></slot>`
  }
}
