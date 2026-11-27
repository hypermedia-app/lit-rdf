import type { Environment as RdfEnv } from '@rdfjs/environment/Environment.js'
import type { DataFactory } from '@rdfjs/types'
import type NsBuildersFactory from '@tpluscode/rdf-ns-builders'
import type { DatasetFactory } from '@zazuko/env/lib/DatasetFactory.js'
import type $rdf from '@zazuko/env/web.js'
import type ClownfaceFactory from 'clownface/Factory.js'

let configuredEnvironment: Environment | undefined

/** Sets the environment used by new `<rdf-environment>` elements. Call during app startup. */
export function configureEnvironment(rdf: Environment): void {
  configuredEnvironment = rdf
}

export function getConfiguredEnvironment(): Environment | undefined {
  return configuredEnvironment
}

/** Augment this interface with an `rdf` property to register the app's environment type. */
export interface EnvironmentConfig {
  [option: string]: unknown
}

/** RDF/JS environment with the Clownface, dataset, data model, and namespace builder factories. */
export type MinimumEnvironment = RdfEnv<ClownfaceFactory | DatasetFactory | DataFactory | NsBuildersFactory>

/** The registered RDF/JS environment type, defaulting to the full stock web environment. */
export type Environment = EnvironmentConfig extends { rdf: infer Rdf }
  ? Rdf extends MinimumEnvironment ? Rdf : never
  : typeof $rdf
