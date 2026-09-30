import { LitElement, nothing } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import type { DatasetCore, NamedNode } from '@rdfjs/types'
import { consume } from '@lit/context'
import type { DatasetProvider } from '../context.js'
import { datasetProvider } from '../context.js'
import { toNamedNode } from '../converter.js'

/**
 * Custom element (`<rdf-graph>`) that contributes an RDF graph dataset to an ancestor
 * `DatasetProvider` (such as `<rdf-dataset>`).
 *
 * @element rdf-graph
 */
@customElement('rdf-graph')
export default class RdfGraph extends LitElement {
  /**
   * The RDF/JS dataset containing the graph triples to contribute to the parent dataset provider.
   */
  @state()
  value: DatasetCore | undefined

  /**
   * Optional named graph URI for the contributed dataset. If omitted, the triples belong to the default graph.
   */
  @property({ type: Object, converter: toNamedNode })
  graph: NamedNode | undefined

  @state()
  @consume({ context: datasetProvider })
  private datasetProvider: DatasetProvider | undefined

  protected updated(properties: Map<string, unknown>) {
    if (properties.has('value')) {
      if (this.value) {
        this.datasetProvider?.updateGraph(this, this.value, this.graph)
      }
      else {
        this.datasetProvider?.removeGraph(this)
      }
    }
  }

  connectedCallback() {
    super.connectedCallback()
    if (this.value) {
      this.datasetProvider?.updateGraph(this, this.value, this.graph)
    }
  }

  disconnectedCallback() {
    this.datasetProvider?.removeGraph(this)
  }

  render() {
    return nothing
  }
}
