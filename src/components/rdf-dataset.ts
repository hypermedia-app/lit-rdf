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

  /**
   * The RDF/JS dataset representing the combined data graph provided in context to descendant elements.
   */
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

  /**
   * Registers or updates a named or default graph contributed by a child element.
   *
   * @param host The hosting element contributing the graph
   * @param dataset The RDF/JS dataset representing the graph
   * @param graph Optional named graph URI
   */
  updateGraph(host: HTMLElement, dataset: DatasetCore, graph: NamedNode | undefined): void {
    this.graphs.set(host, { dataset, graph })
    this.updateDataset()
  }

  /**
   * Removes a graph previously registered by a child element.
   *
   * @param host The hosting element whose graph to remove
   */
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
