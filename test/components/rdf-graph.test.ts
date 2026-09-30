import { expect, fixture, html } from '@open-wc/testing'
import sinon from 'sinon'
import { LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'
import { provide } from '@lit/context'
import type {DataFactory, DatasetCore} from '@rdfjs/types'
import $rdf from '@zazuko/env/web.js'
import { datasetProvider, type DatasetProvider, environment, type Environment } from '../../src/context.js'
import type RdfGraph from '../../src/components/rdf-graph.js'
import '../../src/components/rdf-graph.js'

@customElement('test-dataset')
class TestDataset extends LitElement implements DatasetProvider {
  @provide({ context: datasetProvider })
  provider: DatasetProvider = this

  @provide({ context: environment })
  rdf: Environment = $rdf

  updateGraph = sinon.spy()
  removeGraph = sinon.spy()

  render() {
    return html`<slot></slot>`
  }
}

describe('rdf-graph', function () {
  afterEach(function () {
    delete window.graphs
  })

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

  it('populates value from window.graphs matching element id on connectedCallback', async function () {
    const factoryFn = sinon.spy(({ factory }: { factory: DataFactory }) => [
      factory.quad(
        factory.namedNode('http://example.org/subject'),
        factory.namedNode('http://example.org/predicate'),
        factory.literal('test-value'),
      ),
    ])

    window.graphs = {
      'test-graph': factoryFn,
    }

    const parent = await fixture<TestDataset>(html`
      <test-dataset>
        <rdf-graph id="test-graph"></rdf-graph>
      </test-dataset>
    `)

    const graph = parent.querySelector<RdfGraph>('rdf-graph')!
    expect(factoryFn).to.have.been.calledOnce
    expect(graph.value).to.be.ok
    expect(graph.value?.size).to.equal(1)

    const quad = [...graph.value!][0]
    expect(quad.subject.value).to.equal('http://example.org/subject')
    expect(quad.predicate.value).to.equal('http://example.org/predicate')
    expect(quad.object.value).to.equal('test-value')

    expect(parent.updateGraph).to.have.been.calledWith(graph, graph.value, undefined)
  })

  it('populates value from window.graphs with named graph', async function () {
    const graphUri = $rdf.namedNode('http://example.org/named-graph')
    window.graphs = {
      'named-g': ({ factory }) => [
        factory.quad(
          factory.namedNode('http://example.org/s'),
          factory.namedNode('http://example.org/p'),
          factory.literal('named-val'),
        ),
      ],
    }

    const parent = await fixture<TestDataset>(html`
      <test-dataset>
        <rdf-graph id="named-g" .graph=${graphUri}></rdf-graph>
      </test-dataset>
    `)

    const graph = parent.querySelector<RdfGraph>('rdf-graph')!
    expect(graph.value?.size).to.equal(1)
    expect(parent.updateGraph).to.have.been.calledWith(graph, graph.value, graphUri)
  })

  it('does not overwrite explicitly provided value with window.graphs', async function () {
    const explicitDataset = $rdf.dataset([
      $rdf.quad(
        $rdf.namedNode('http://example.org/explicit'),
        $rdf.namedNode('http://example.org/p'),
        $rdf.literal('explicit-val'),
      ),
    ])

    const factoryFn = sinon.spy(() => [])
    window.graphs = {
      'custom-graph': factoryFn,
    }

    const parent = await fixture<TestDataset>(html`
      <test-dataset>
        <rdf-graph id="custom-graph" .value=${explicitDataset}></rdf-graph>
      </test-dataset>
    `)

    const graph = parent.querySelector<RdfGraph>('rdf-graph')!
    expect(factoryFn).not.to.have.been.called
    expect(graph.value).to.equal(explicitDataset)
  })

  it('does not populate value if element id is not in window.graphs', async function () {
    window.graphs = {
      'other-graph': ({ factory }) => [
        factory.quad(
          factory.namedNode('http://example.org/other'),
          factory.namedNode('http://example.org/p'),
          factory.literal('other-val'),
        ),
      ],
    }

    const parent = await fixture<TestDataset>(html`
      <test-dataset>
        <rdf-graph id="unknown-graph"></rdf-graph>
      </test-dataset>
    `)

    const graph = parent.querySelector<RdfGraph>('rdf-graph')!
    expect(graph.value).to.be.undefined
    expect(parent.updateGraph).not.to.have.been.called
  })

  it('does not throw when window.graphs is undefined', async function () {
    window.graphs = undefined

    const parent = await fixture<TestDataset>(html`
      <test-dataset>
        <rdf-graph id="any-graph"></rdf-graph>
      </test-dataset>
    `)

    const graph = parent.querySelector<RdfGraph>('rdf-graph')!
    expect(graph.value).to.be.undefined
  })

  it('populates value when dynamically inserted into DOM', async function () {
    window.graphs = {
      'dynamic-graph': ({ factory }) => [
        factory.quad(
          factory.namedNode('http://example.org/dyn'),
          factory.namedNode('http://example.org/p'),
          factory.literal('dyn-val'),
        ),
      ],
    }

    const parent = await fixture<TestDataset>(html`
      <test-dataset></test-dataset>
    `)

    const dynamicGraph = document.createElement('rdf-graph') as RdfGraph
    dynamicGraph.id = 'dynamic-graph'

    parent.appendChild(dynamicGraph)
    await dynamicGraph.updateComplete

    expect(dynamicGraph.value).to.be.ok
    expect(dynamicGraph.value?.size).to.equal(1)
    expect(parent.updateGraph).to.have.been.calledWith(dynamicGraph, dynamicGraph.value, undefined)
  })

  it('uses custom environment provided by parent context', async function () {
    const origDataset = $rdf.dataset.bind($rdf)
    const customEnv = Object.create($rdf)
    customEnv.dataset = sinon.spy((...args: any[]) => origDataset(...args))

    window.graphs = {
      'custom-env-graph': ({ factory }) => [
        factory.quad(
          factory.namedNode('http://example.org/c'),
          factory.namedNode('http://example.org/p'),
          factory.literal('custom-env-val'),
        ),
      ],
    }

    const parent = await fixture<TestDataset>(html`
      <test-dataset .rdf=${customEnv}>
        <rdf-graph id="custom-env-graph"></rdf-graph>
      </test-dataset>
    `)

    const graph = parent.querySelector<RdfGraph>('rdf-graph')!
    expect(customEnv.dataset).to.have.been.called
    expect(graph.value?.size).to.equal(1)
    expect(parent.updateGraph).to.have.been.calledWith(graph, graph.value, undefined)
  })
})
