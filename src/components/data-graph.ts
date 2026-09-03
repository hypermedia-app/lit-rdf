import { css, LitElement, nothing } from 'lit'
import { customElement } from 'lit/decorators.js'
import { provideDataset } from '../mixins/datasetProvider.js'

/**
 * A container element that consumes or provides an RDF dataset and exposes a Clownface
 * graph pointer context to descendant elements.
 *
 * @summary Provides a clownface graph pointer context to child elements.
 * @tag data-graph
 * @slot - Default slot for child elements that consume the RDF graph context.
 */
@customElement('data-graph')
export default class DataGraph extends provideDataset(LitElement) {
  static styles = css`
    :host {
      display: none;
    }
  `
  render(): unknown {
    return nothing
  }
}
