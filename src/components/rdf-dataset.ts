import { css, html, LitElement } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { provide } from '@lit/context'
import type { DatasetCore, NamedNode } from '@rdfjs/types'
import type { DatasetProvider } from '../context.js'
import { dataset as context, datasetProvider } from '../context.js'
import { Environment } from '../controllers/Environment.js'

/**
 * A container element that consumes or provides an RDF dataset and exposes a Clownface
 * graph pointer context to descendant elements.
 *
 * @summary Provides a clownface graph pointer context to child elements.
 * @tag rdf-dataset
 * @slot - Default slot for child elements that consume the RDF graph context.
 */
@customElement('rdf-dataset')
export default class RdfDataset extends LitElement implements DatasetProvider {
  static styles = css`
    :host {
      display: contents;
    }
  `

  private graphs: Map<HTMLElement, { dataset: DatasetCore, graph: NamedNode | undefined }> = new Map()

  private env: Environment

  @provide({ context })
  @property({ type: Object })
  public value: DatasetCore | undefined

  @provide({ context: datasetProvider })
  @state()
  private provider: DatasetProvider

  constructor() {
    super()

    this.env = new Environment(this)
    this.provider = this
  }

  updateGraph(host: HTMLElement, dataset: DatasetCore, graph: NamedNode | undefined): void {
    this.graphs.set(host, { dataset, graph })
    this.updateDataset()
  }

  removeGraph(host: HTMLElement): void {
    this.graphs.delete(host)
    this.updateDataset()
  }

  private updateDataset() {
    this.value = [...this.graphs.values()]
      .reduce((acc: ReturnType<typeof this.env.value.dataset>, { dataset, graph }) => {
        if (graph) {
          return acc.merge([...dataset].map(quad => this.env.value.fromQuad({
            ...quad,
            termType: 'Quad',
            graph,
          })))
        }

        return acc.merge(dataset)
      }, this.env.value.dataset())
  }

  render(): unknown {
    return html`<slot></slot>`
  }
}
