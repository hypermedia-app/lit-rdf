import type { Context } from '@lit/context'
import { ContextConsumer } from '@lit/context'
import type { ReactiveControllerHost } from 'lit'
import type { AnyPointer } from 'clownface'
import { dataset } from '../context.js'

/**
 * Reactive controller for consuming the ambient RDF graph pointer (`dataset` context).
 */
export class Graph {
  private consumer: ContextConsumer<Context<unknown, AnyPointer>, ReactiveControllerHost & HTMLElement>

  /**
   * Initializes the Graph controller for the host element.
   *
   * @param host The hosting LitElement / ReactiveControllerHost
   * @param callback Optional callback invoked when the graph pointer in context updates
   */
  constructor(host: ReactiveControllerHost & HTMLElement, callback?: (value: AnyPointer | undefined) => void) {
    this.consumer = new ContextConsumer(host, {
      context: dataset,
      subscribe: true,
      callback,
    })
  }

  /**
   * Gets the consumed clownface graph pointer.
   */
  get value() {
    return this.consumer.value
  }
}
