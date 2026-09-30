import { css, html, LitElement } from 'lit'
import env from '@zazuko/env/web.js'
import { customElement, state } from 'lit/decorators.js'
import { provide } from '@lit/context'
import { type Environment, environment as context } from '../context.js'

/**
 * An element that provides an RDF/JS environment in the context for all downstream elements.
 *
 * @summary Provides an RDF/JS environment in context.
 * @tag rdf-environment
 * @slot - Default slot for child elements that consume the RDF environment.
 */
@customElement('rdf-environment')
export default class RdfEnvironment extends LitElement {
  static styles = css`
    :host {
      display: contents;
    }
  `
  /**
   * The RDF/JS environment instance provided in context to descendant elements.
   */
  @state()
  @provide({ context })
  public rdf!: Environment

  constructor() {
    super()

    this.rdf = env
  }

  render() {
    return html`<slot></slot>`
  }
}
