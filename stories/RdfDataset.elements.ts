import { html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import toCanonical from 'rdf-dataset-ext/toCanonical.js'
import { Dataset, Environment } from '../src/controllers.js'

@customElement('print-dataset')
export class PrintDataset extends LitElement {
  declare env: Environment
  datasetController: Dataset

  @property({ type: String })
  serialized: string = ''

  constructor() {
    super()

    this.env = new Environment(this)
    this.datasetController = new Dataset(this, async (dataset) => {
      if (!dataset) {
        this.serialized = 'Empty'
        return
      }

      this.serialized = toCanonical(dataset)
    })
  }

  render() {
    return html`Dataset: <code><pre>${this.serialized}</pre></code>`
  }
}
