import { LitElement, nothing } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import type { DatasetCore, NamedNode } from '@rdfjs/types'
import { consume } from '@lit/context'
import type { DatasetProvider } from '../context.js'
import { datasetProvider } from '../context.js'
import { toNamedNode } from '../converter.js'

@customElement('rdf-graph')
export default class RdfGraph extends LitElement {
  @state()
  value: DatasetCore | undefined

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
