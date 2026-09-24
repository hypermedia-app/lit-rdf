import { css, html, LitElement } from 'lit'
import { consume } from '@lit/context'
import type { AnyPointer } from 'clownface'
import { customElement, state } from 'lit/decorators.js'
import { dataset } from '../context.js'
import { provideGraph } from '../mixins/graph.js'

/**
 * A container element that consumes or provides an RDF dataset and exposes a Clownface
 * graph pointer context to descendant elements.
 *
 * @summary Provides a clownface graph pointer context to child elements.
 * @tag data-graph
 * @slot - Default slot for child elements that consume the RDF graph context.
 */
@customElement('data-graph')
export default class DataGraph extends provideGraph(LitElement) {
  static styles = css`
    :host {
      display: contents;
    }
  `

  /**
   * The parent clownface graph pointer consumed from the nearest ancestor context.
   */
  @consume({ context: dataset, subscribe: true })
  @state()
  public parent: AnyPointer | undefined

  render(): unknown {
    return html`
            <slot></slot>`
  }
}
