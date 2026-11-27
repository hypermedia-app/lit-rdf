import $rdf from '@zazuko/env/web.js'
import { getConfiguredEnvironment } from './environment.js'
import type { Environment, MinimumEnvironment } from './environment.js'

export function getDefaultEnvironment(): Environment {
  const rdf: MinimumEnvironment = getConfiguredEnvironment() ?? $rdf
  // Apps that augment EnvironmentConfig supply their environment during startup.
  return rdf as Environment
}
