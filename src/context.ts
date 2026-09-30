import { createContext } from '@lit/context'
import type { GraphPointer, MultiPointer } from 'clownface'
import type env from '@zazuko/env/web.js'
import type { DatasetCore, NamedNode, Term } from '@rdfjs/types'

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

/**
 * Interface for parent elements (such as `<rdf-dataset>`) that allow child elements
 * to contribute RDF graph contents, combine them into a unified dataset, and provide
 * the resulting dataset to consumers.
 */
export interface DatasetProvider {
  /**
   * Registers or updates a named or default graph contributed by a child element.
   *
   * @param host The hosting child element contributing the graph
   * @param graph The RDF/JS dataset representing the graph
   * @param uri Optional named graph URI
   */
  updateGraph: (host: HTMLElement, graph: DatasetCore, uri?: NamedNode) => void

  /**
   * Removes a graph previously registered by a child element.
   *
   * @param host The hosting child element whose graph to remove
   */
  removeGraph: (host: HTMLElement) => void
}

/**
 * Lit Context identifier for providing and consuming the `DatasetProvider` interface,
 * allowing child elements to register and remove graphs with their parent dataset provider.
 */
export const datasetProvider = createContext<DatasetProvider>(Symbol('datasetProvider'))

/**
 * Lit Context identifier for providing and consuming the ambient RDF/JS Dataset
 */
export const dataset = createContext<DatasetCore | undefined>(Symbol('dataset'))

/**
 * Lit Context identifier for providing and consuming the current clownface Focus Node pointer(s).
 */
export const focusNode = createContext<MultiPointer | undefined>(Symbol('focus-node'))

/**
 * Lit Context identifier for providing and consuming the active focus node Sort Predicate.
 */
export const sortPredicate = createContext<SortPredicate | undefined>(Symbol('focus-node-sort'))

/**
 * Lit Context identifier for providing and consuming the active focus node Sort Direction ('asc' or 'desc').
 */
export const sortDirection = createContext<'asc' | 'desc' | undefined>(Symbol('focus-node-sort-dir'))
