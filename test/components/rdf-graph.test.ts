import { expect, fixture, html } from '@open-wc/testing'
import sinon from 'sinon'
import { LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'
import { provide } from '@lit/context'
import type { DatasetCore } from '@rdfjs/types'
import $rdf from '@zazuko/env/web.js'
import { datasetProvider, type DatasetProvider } from '../../src/context.js'
import type RdfGraph from '../../src/components/rdf-graph.js'
import '../../src/components/rdf-graph.js'

@customElement('test-dataset')
class TestDataset extends LitElement implements DatasetProvider {
  @provide({ context: datasetProvider })
  provider: DatasetProvider = this

  updateGraph = sinon.spy()
  removeGraph = sinon.spy()

  render() {
    return html`<slot></slot>`
  }
}

describe('rdf-graph', function () {
  it('calls datasetProvider#remove when graph value is set to undefined', async function () {
    const dataset: DatasetCore = $rdf.dataset()
    const parent = await fixture<TestDataset>(html`
      <test-dataset>
        <rdf-graph .value=${dataset}></rdf-graph>
      </test-dataset>
    `)

    const graph = parent.querySelector<RdfGraph>('rdf-graph')!
    expect(parent.updateGraph).to.have.been.calledWith(graph, dataset, undefined)

    graph.value = undefined
    await graph.updateComplete

    expect(parent.removeGraph).to.have.been.calledWith(graph)
  })

  it('calls datasetProvider#remove when graph value is set to undefined for a named graph', async function () {
    const dataset: DatasetCore = $rdf.dataset()
    const graphUri = $rdf.namedNode('http://example.org/named-graph')
    const parent = await fixture<TestDataset>(html`
      <test-dataset>
        <rdf-graph .value=${dataset} .graph=${graphUri}></rdf-graph>
      </test-dataset>
    `)

    const graph = parent.querySelector<RdfGraph>('rdf-graph')!
    expect(parent.updateGraph).to.have.been.calledWith(graph, dataset, graphUri)

    graph.value = undefined
    await graph.updateComplete

    expect(parent.removeGraph).to.have.been.calledWith(graph)
  })
})
