import type { GraphPointer } from 'clownface'
import type { Literal, Term } from '@rdfjs/types'
import { fromRdf } from 'rdf-literal'
import type { SortPredicate } from './context.js'

export function toComparable(value: Term | string | number | boolean | undefined | null): unknown {
  if (value === undefined || value === null) {
    return undefined
  }
  if (typeof value === 'object' && 'termType' in value) {
    if (value.termType === 'Literal') {
      return fromRdf(value as Literal)
    }
    return value.value
  }
  return value
}

export function compareValues(left: unknown, right: unknown): number {
  if (left === right) {
    return 0
  }
  if ((left === undefined || left === null) && (right === undefined || right === null)) {
    return 0
  }
  if (left === undefined || left === null) {
    return 1
  }
  if (right === undefined || right === null) {
    return -1
  }

  if (typeof left === 'string' && typeof right === 'string') {
    return left.localeCompare(right)
  }

  if (typeof left === 'number' && typeof right === 'number') {
    return left - right
  }

  if (typeof left === 'boolean' && typeof right === 'boolean') {
    return Number(left) - Number(right)
  }

  if (left instanceof Date && right instanceof Date) {
    return left.getTime() - right.getTime()
  }

  if (left < right) {
    return -1
  }
  if (left > right) {
    return 1
  }

  return 0
}

export function sort(getValue: SortPredicate, direction: 'asc' | 'desc' = 'asc') {
  return (left: GraphPointer, right: GraphPointer): number => {
    const leftValue = toComparable(getValue(left))
    const rightValue = toComparable(getValue(right))

    const leftEmpty = leftValue === undefined || leftValue === null
    const rightEmpty = rightValue === undefined || rightValue === null

    if (leftEmpty && rightEmpty) return 0
    if (leftEmpty) return 1
    if (rightEmpty) return -1

    const result = compareValues(leftValue, rightValue)
    return direction === 'desc' ? -result : result
  }
}
