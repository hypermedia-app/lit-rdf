import type { ReactiveControllerHost } from 'lit'
import { type Context, ContextConsumer } from '@lit/context'
import { environment } from '../context.js'
import type { Environment as AppEnvironment } from '../environment.js'

function missingEnvironmentError() {
  return new Error('Environment not available. Make sure a parent <rdf-environment> element or provideEnvironment() mixin provides a defined rdf environment.')
}

/**
 * Reactive controller for consuming the ambient RDF/JS environment from context.
 */
export class Environment<E extends AppEnvironment = AppEnvironment> {
  private consumer: ContextConsumer<Context<unknown, E>, ReactiveControllerHost & HTMLElement>

  /**
   * Initializes the environment controller for the host element.
   *
   * @param host The hosting LitElement / ReactiveControllerHost
   * @param callback Optional callback invoked whenever the environment becomes available or changes
   */
  constructor(host: ReactiveControllerHost & HTMLElement, callback?: (value: E) => void) {
    this.consumer = new ContextConsumer(host, {
      context: environment as Context<unknown, E>,
      callback: (value) => {
        if (value) {
          callback?.(value)
        }
      },
    })

    host.addController({
      hostConnected: () => {
        if (!this.consumer.value) {
          throw missingEnvironmentError()
        }
      },
      hostDisconnected: () => {
        this.consumer.value = undefined
      },
    })
  }

  /**
   * Gets the consumed RDF/JS environment.
   * Throws an error if no ancestor element provides the environment.
   */
  get value() {
    if (!this.consumer.value) {
      throw missingEnvironmentError()
    }

    return this.consumer.value
  }
}
