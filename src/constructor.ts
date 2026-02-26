import type { LitElement } from 'lit'
import type { AnyPointer, MultiPointer } from 'clownface'
import type { Environment } from './context.js'

export type LitElementConstructor<T = {}> = new (...args: any[]) => T & LitElement;

export type WithGraph = {
  graph: AnyPointer | undefined
}

export type WithEnvironment = {
  rdf: Environment
}

export type WithFocusNode = {
  focusNode: MultiPointer | undefined
}
