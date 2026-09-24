import type { LitElement } from 'lit'
import type { AnyPointer, MultiPointer } from 'clownface'
import type { Environment } from './context.js'

/**
 * Constructor type for LitElement classes and mixins.
 */
export type LitElementConstructor<T = unknown> = new (...args: any[]) => T & LitElement

/**
 * Interface for elements providing a clownface dataset graph pointer.
 */
export type WithGraph = {
  /** The clownface graph pointer. */
  graph: AnyPointer | undefined
}

/**
 * Interface for elements providing an RDF/JS environment.
 */
export type WithEnvironment = {
  /** The RDF/JS environment instance. */
  rdf: Environment
}

/**
 * Interface for elements providing a clownface focus node pointer.
 */
export type WithFocusNode = {
  /** The clownface focus node pointer. */
  focusNode: MultiPointer | undefined
}
