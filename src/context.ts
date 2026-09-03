import { createContext } from '@lit/context'
import type { GraphPointer, MultiPointer } from 'clownface'
import type env from '@zazuko/env/web.js'
import type { DatasetCore, Term } from '@rdfjs/types'

/**
 * Type representing the RDF/JS environment instance from `@zazuko/env`.
 */
export type Environment = typeof env

/**
 * Function type that extracts a sort key (RDF Term, string, number, or boolean) from a clownface GraphPointer.
 */
export interface SortPredicate {
  (node: GraphPointer): Term | string | number | boolean | undefined
}

/**
 * Lit Context identifier for providing and consuming the RDF/JS Environment.
 */
export const environment = createContext<Environment>(Symbol('environment'))
<<<<<<< HEAD

/**
 * Lit Context identifier for providing and consuming the ambient clownface Dataset / Graph pointer.
 */
export const dataset = createContext<AnyPointer | undefined>(Symbol('dataset'))

/**
 * Lit Context identifier for providing and consuming the current clownface Focus Node pointer(s).
 */
=======
export const dataset = createContext<DatasetCore[] | undefined>(Symbol('dataset'))
>>>>>>> db9a963 (wip)
export const focusNode = createContext<MultiPointer | undefined>(Symbol('focus-node'))

/**
 * Lit Context identifier for providing and consuming the active focus node Sort Predicate.
 */
export const sortPredicate = createContext<SortPredicate | undefined>(Symbol('focus-node-sort'))

/**
 * Lit Context identifier for providing and consuming the active focus node Sort Direction ('asc' or 'desc').
 */
export const sortDirection = createContext<'asc' | 'desc' | undefined>(Symbol('focus-node-sort-dir'))
