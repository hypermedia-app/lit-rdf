import { describe, expect, it } from 'vitest'
import $rdf from '@zazuko/env'
import type { GraphPointer } from 'clownface'
import { compareValues, sort, toComparable } from '../src/sort.js'

describe('sort utility', () => {
  describe('toComparable', () => {
    it('returns undefined for undefined and null', () => {
      expect(toComparable(undefined)).toBeUndefined()
      expect(toComparable(null)).toBeUndefined()
    })

    it('returns primitive values as-is', () => {
      expect(toComparable('hello')).toBe('hello')
      expect(toComparable(42)).toBe(42)
      expect(toComparable(true)).toBe(true)
      expect(toComparable(false)).toBe(false)
    })

    it('converts RDF string literals', () => {
      const term = $rdf.literal('hello')
      expect(toComparable(term)).toBe('hello')
    })

    it('converts RDF integer literals to numbers', () => {
      const term = $rdf.literal('42', $rdf.namedNode('http://www.w3.org/2001/XMLSchema#integer'))
      expect(toComparable(term)).toBe(42)
      expect(typeof toComparable(term)).toBe('number')
    })

    it('converts RDF double literals to numbers', () => {
      const term = $rdf.literal('3.14', $rdf.namedNode('http://www.w3.org/2001/XMLSchema#double'))
      expect(toComparable(term)).toBe(3.14)
    })

    it('converts RDF boolean literals to booleans', () => {
      const trueTerm = $rdf.literal('true', $rdf.namedNode('http://www.w3.org/2001/XMLSchema#boolean'))
      const falseTerm = $rdf.literal('false', $rdf.namedNode('http://www.w3.org/2001/XMLSchema#boolean'))
      expect(toComparable(trueTerm)).toBe(true)
      expect(toComparable(falseTerm)).toBe(false)
    })

    it('converts RDF date/dateTime literals to Date objects', () => {
      const dateTerm = $rdf.literal('2024-01-15T12:00:00Z', $rdf.namedNode('http://www.w3.org/2001/XMLSchema#dateTime'))
      const comparable = toComparable(dateTerm)
      expect(comparable).toBeInstanceOf(Date)
    })

    it('returns URI string for NamedNodes', () => {
      const node = $rdf.namedNode('http://example.com/item')
      expect(toComparable(node)).toBe('http://example.com/item')
    })

    it('returns blank node identifier for BlankNodes', () => {
      const bnode = $rdf.blankNode('b1')
      expect(toComparable(bnode)).toBe('b1')
    })
  })

  describe('compareValues', () => {
    it('returns 0 for equal values', () => {
      expect(compareValues('a', 'a')).toBe(0)
      expect(compareValues(10, 10)).toBe(0)
      expect(compareValues(true, true)).toBe(0)
      expect(compareValues(undefined, undefined)).toBe(0)
      expect(compareValues(null, null)).toBe(0)
      expect(compareValues(undefined, null)).toBe(0)
    })

    it('places undefined/null at the end', () => {
      expect(compareValues(undefined, 'a')).toBe(1)
      expect(compareValues(null, 'a')).toBe(1)
      expect(compareValues('a', undefined)).toBe(-1)
      expect(compareValues('a', null)).toBe(-1)
      expect(compareValues(undefined, 10)).toBe(1)
      expect(compareValues(10, undefined)).toBe(-1)
    })

    it('compares strings alphabetically with localeCompare', () => {
      expect(compareValues('apple', 'banana')).toBeLessThan(0)
      expect(compareValues('banana', 'apple')).toBeGreaterThan(0)
    })

    it('compares numbers numerically', () => {
      expect(compareValues(2, 10)).toBeLessThan(0)
      expect(compareValues(10, 2)).toBeGreaterThan(0)
      expect(compareValues(-5, 5)).toBeLessThan(0)
      expect(compareValues(100, 20)).toBeGreaterThan(0)
    })

    it('compares booleans with false before true', () => {
      expect(compareValues(false, true)).toBeLessThan(0)
      expect(compareValues(true, false)).toBeGreaterThan(0)
    })

    it('compares Date instances chronologically', () => {
      const date1 = new Date('2024-01-01')
      const date2 = new Date('2024-06-01')
      expect(compareValues(date1, date2)).toBeLessThan(0)
      expect(compareValues(date2, date1)).toBeGreaterThan(0)
      expect(compareValues(date1, new Date('2024-01-01'))).toBe(0)
    })
  })

  describe('sort comparator function', () => {
    function createPointers() {
      const cf = $rdf.clownface({ dataset: $rdf.dataset() })
      const ex = $rdf.namespace('http://example.com/')
      const xsd = $rdf.namespace('http://www.w3.org/2001/XMLSchema#')

      const node1 = cf.node(ex.item1)
      const node2 = cf.node(ex.item2)
      const node3 = cf.node(ex.item3)

      node1.addOut(ex.num, $rdf.literal('10', xsd.integer))
      node1.addOut(ex.label, $rdf.literal('Cherry'))
      node1.addOut(ex.flag, $rdf.literal('true', xsd.boolean))

      node2.addOut(ex.num, $rdf.literal('2', xsd.integer))
      node2.addOut(ex.label, $rdf.literal('Apple'))
      node2.addOut(ex.flag, $rdf.literal('false', xsd.boolean))

      node3.addOut(ex.num, $rdf.literal('100', xsd.integer))
      node3.addOut(ex.label, $rdf.literal('Banana'))
      node3.addOut(ex.flag, $rdf.literal('true', xsd.boolean))

      return { node1, node2, node3, ex }
    }

    it('sorts numerically in ascending order', () => {
      const { node1, node2, node3, ex } = createPointers()
      const list = [node1, node3, node2]

      const sorted = list.sort(sort((n: GraphPointer) => n.out(ex.num).term, 'asc'))
      expect(sorted.map(n => n.value)).toEqual([
        'http://example.com/item2',
        'http://example.com/item1',
        'http://example.com/item3',
      ])
    })

    it('sorts numerically in descending order', () => {
      const { node1, node2, node3, ex } = createPointers()
      const list = [node1, node3, node2]

      const sorted = list.sort(sort((n: GraphPointer) => n.out(ex.num).term, 'desc'))
      expect(sorted.map(n => n.value)).toEqual([
        'http://example.com/item3',
        'http://example.com/item1',
        'http://example.com/item2',
      ])
    })

    it('sorts strings in ascending order by default', () => {
      const { node1, node2, node3, ex } = createPointers()
      const list = [node1, node3, node2]

      const sorted = list.sort(sort((n: GraphPointer) => n.out(ex.label).term))
      expect(sorted.map(n => n.value)).toEqual([
        'http://example.com/item2', // Apple
        'http://example.com/item3', // Banana
        'http://example.com/item1', // Cherry
      ])
    })

    it('sorts strings in descending order', () => {
      const { node1, node2, node3, ex } = createPointers()
      const list = [node1, node3, node2]

      const sorted = list.sort(sort((n: GraphPointer) => n.out(ex.label).term, 'desc'))
      expect(sorted.map(n => n.value)).toEqual([
        'http://example.com/item1', // Cherry
        'http://example.com/item3', // Banana
        'http://example.com/item2', // Apple
      ])
    })

    it('sorts booleans in ascending and descending order', () => {
      const { node1, node2, node3, ex } = createPointers()
      const list = [node1, node2, node3]

      const sortedAsc = [...list].sort(sort((n: GraphPointer) => n.out(ex.flag).term, 'asc'))
      expect(sortedAsc[0].value).toBe('http://example.com/item2') // false

      const sortedDesc = [...list].sort(sort((n: GraphPointer) => n.out(ex.flag).term, 'desc'))
      expect(sortedDesc[2].value).toBe('http://example.com/item2') // false is last
    })

    it('handles nodes with missing sort properties in ascending and descending order', () => {
      const { node1, node2, ex } = createPointers()
      const cf = $rdf.clownface({ dataset: $rdf.dataset() })
      const nodeNoProp = cf.node(ex.itemWithoutProp)

      const list = [nodeNoProp, node1, node2]

      const sortedAsc = [...list].sort(sort((n: GraphPointer) => n.out(ex.label).term, 'asc'))
      expect(sortedAsc.map(n => n.value)).toEqual([
        'http://example.com/item2', // Apple
        'http://example.com/item1', // Cherry
        'http://example.com/itemWithoutProp', // missing (undefined) sorts last in asc
      ])

      const sortedDesc = [...list].sort(sort((n: GraphPointer) => n.out(ex.label).term, 'desc'))
      expect(sortedDesc.map(n => n.value)).toEqual([
        'http://example.com/item1', // Cherry
        'http://example.com/item2', // Apple
        'http://example.com/itemWithoutProp', // missing (undefined) sorts last in desc
      ])
    })

    it('supports custom predicate returning raw JS primitives', () => {
      const { node1, node2, node3 } = createPointers()
      const weights: Record<string, number> = {
        'http://example.com/item1': 50,
        'http://example.com/item2': 100,
        'http://example.com/item3': 10,
      }

      const list = [node1, node2, node3]
      const sorted = list.sort(sort((n: GraphPointer) => weights[n.value], 'asc'))

      expect(sorted.map(n => n.value)).toEqual([
        'http://example.com/item3', // 10
        'http://example.com/item1', // 50
        'http://example.com/item2', // 100
      ])
    })
  })
})
