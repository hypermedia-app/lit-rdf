import { expect, fixture, html } from '@open-wc/testing'
import $rdf from '@zazuko/env/web.js'
import type { GraphPointer } from 'clownface'
import type { NamedNode } from '@rdfjs/types'
import type TargetNode from '../../src/components/target-node.js'
import '../../src/components/rdf-environment.js'
import '../../src/components/rdf-dataset.js'
import '../../src/components/target-node.js'

const alice = $rdf.namedNode('https://example.org/alice')
const bob = $rdf.namedNode('https://example.org/bob')
const person = $rdf.namedNode('https://example.org/Person')
const knows = $rdf.namedNode('https://example.org/knows')
const dataset = $rdf.dataset([
  $rdf.quad(alice, $rdf.ns.rdf.type, person),
  $rdf.quad(alice, knows, bob),
])

const selectors = [
  { property: 'targetNode', term: alice, expected: alice },
  { property: 'targetClass', term: person, expected: alice },
  { property: 'targetSubjectsOf', term: knows, expected: alice },
  { property: 'targetObjectsOf', term: knows, expected: bob },
] as const

describe('target-node selectors', function () {
  for (const { property, term, expected } of selectors) {
    for (const usePointer of [false, true]) {
      it(`selects from the ambient dataset with ${property} bound to a ${usePointer ? 'GraphPointer' : 'NamedNode'}`, async function () {
        const root = await fixture(html`
          <rdf-environment>
            <rdf-dataset .value=${dataset}>
              <target-node></target-node>
            </rdf-dataset>
          </rdf-environment>
        `)
        const target = root.querySelector<TargetNode>('target-node')!
        // Use an empty, distinct dataset: the pointer supplies the selector term only.
        const value: NamedNode | GraphPointer = usePointer
          ? $rdf.clownface({ dataset: $rdf.dataset() }).node(term)
          : term
        target[property] = value
        await target.updateComplete

        expect(target.focusNode?.terms).to.have.length(1)
        expect(target.focusNode?.term?.equals(expected)).to.equal(true)
        expect(target.focusNode?.dataset).to.equal(dataset)
      })
    }
  }
})
