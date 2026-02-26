import { createContext } from '@lit/context'
import type { AnyPointer, MultiPointer } from 'clownface'
import type env from '@zazuko/env/web.js'
import type { NamedNode } from '@rdfjs/types'

export type Environment = typeof env

export const environment = createContext<Environment>(Symbol('environment'))
export const dataset = createContext<AnyPointer | undefined>(Symbol('dataset'))
export const focusNode = createContext<MultiPointer | undefined>(Symbol('focus-node'))
export const sortCriteria = createContext<NamedNode | undefined>(Symbol('focus-node-sort'))
