import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type $rdf from '@zazuko/env'
import type { DatasetCore, Quad } from '@rdfjs/types'

interface MockRdfGraphElement {
  id: string
  value?: DatasetCore
}

describe('runtime/data-graph', () => {
  let elements: MockRdfGraphElement[]

  beforeEach(() => {
    vi.resetModules()
    elements = []

    const mockDocument = {
      querySelectorAll: vi.fn((selector: string) => {
        if (selector === 'rdf-graph') {
          return elements
        }
        return []
      }),
    }

    const mockWindow = {
      graphs: undefined as Record<string, (options: { factory: typeof $rdf }) => Quad[]> | undefined,
    }

    vi.stubGlobal('document', mockDocument)
    vi.stubGlobal('window', mockWindow)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  async function loadDataGraph() {
    await import('../../src/runtime/data-graph.js')
  }

  it('populates element value with a dataset created from window.graphs factory', async () => {
    const el: MockRdfGraphElement = { id: 'test-graph' }
    elements.push(el)

    const factoryFn = vi.fn(({ factory }) => [
      factory.quad(
        factory.namedNode('http://example.org/subject'),
        factory.namedNode('http://example.org/predicate'),
        factory.literal('test-value'),
      ),
    ])

    window.graphs = {
      'test-graph': factoryFn,
    }

    await loadDataGraph()

    expect(factoryFn).toHaveBeenCalledTimes(1)
    expect(factoryFn).toHaveBeenCalledWith(
      expect.objectContaining({
        factory: expect.objectContaining({
          dataset: expect.any(Function),
          quad: expect.any(Function),
        }),
      }),
    )

    expect(el.value).toBeDefined()
    expect(el.value?.size).toBe(1)

    const quads = [...el.value!]
    expect(quads[0].subject.value).toBe('http://example.org/subject')
    expect(quads[0].predicate.value).toBe('http://example.org/predicate')
    expect(quads[0].object.value).toBe('test-value')
  })

  it('populates multiple rdf-graph elements with their corresponding datasets', async () => {
    const el1: MockRdfGraphElement = { id: 'graph-1' }
    const el2: MockRdfGraphElement = { id: 'graph-2' }
    elements.push(el1, el2)

    window.graphs = {
      'graph-1': ({ factory }) => [
        factory.quad(
          factory.namedNode('http://example.org/1'),
          factory.namedNode('http://example.org/p'),
          factory.literal('one'),
        ),
      ],
      'graph-2': ({ factory }) => [
        factory.quad(
          factory.namedNode('http://example.org/2'),
          factory.namedNode('http://example.org/p'),
          factory.literal('two'),
        ),
      ],
    }

    await loadDataGraph()

    expect(el1.value?.size).toBe(1)
    expect([...el1.value!][0].object.value).toBe('one')

    expect(el2.value?.size).toBe(1)
    expect([...el2.value!][0].object.value).toBe('two')
  })

  it('ignores elements without an id', async () => {
    const elWithNoId: MockRdfGraphElement = { id: '' }
    elements.push(elWithNoId)

    window.graphs = {
      '': ({ factory }) => [
        factory.quad(
          factory.namedNode('http://example.org/x'),
          factory.namedNode('http://example.org/p'),
          factory.literal('should not be set'),
        ),
      ],
    }

    await loadDataGraph()

    expect(elWithNoId.value).toBeUndefined()
  })

  it('ignores elements whose id is not in window.graphs', async () => {
    const elUnmatched: MockRdfGraphElement = { id: 'unregistered-graph' }
    elements.push(elUnmatched)

    window.graphs = {
      'other-graph': ({ factory }) => [
        factory.quad(
          factory.namedNode('http://example.org/x'),
          factory.namedNode('http://example.org/p'),
          factory.literal('other'),
        ),
      ],
    }

    await loadDataGraph()

    expect(elUnmatched.value).toBeUndefined()
  })

  it('handles window.graphs being undefined without error', async () => {
    const el: MockRdfGraphElement = { id: 'some-graph' }
    elements.push(el)
    window.graphs = undefined

    await expect(loadDataGraph()).resolves.not.toThrow()
    expect(el.value).toBeUndefined()
  })

  it('handles empty querySelectorAll results without error', async () => {
    window.graphs = {
      'some-graph': () => [],
    }

    await expect(loadDataGraph()).resolves.not.toThrow()
  })
})
