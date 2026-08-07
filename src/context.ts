import { createContext } from '@lit/context'
import type { AnyPointer, GraphPointer, MultiPointer } from 'clownface'
import type env from '@zazuko/env/web.js'

export type Environment = typeof env

export interface SortPredicate {
  (node: GraphPointer): string | undefined
}

export const environment = createContext<Environment>(Symbol('environment'))
export const dataset = createContext<AnyPointer | undefined>(Symbol('dataset'))
export const focusNode = createContext<MultiPointer | undefined>(Symbol('focus-node'))
export const sortPredicate = createContext<SortPredicate | undefined>(Symbol('focus-node-sort'))
export const sortDirection = createContext<'asc' | 'desc' | undefined>(Symbol('focus-node-sort-dir'))
