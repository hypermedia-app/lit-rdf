import type { ReactiveControllerHost } from 'lit'
import { type Context, ContextConsumer } from '@lit/context'
import type { DatasetCore } from '@rdfjs/types'
import type { AnyPointer } from 'clownface'
import { dataset } from '../context.js'
import { Environment } from './Environment.js'

/**
 * Reactive controller for consuming the ambient RDF/JS dataset and managing
 * a clownface pointer over the dataset.
 */
export class Dataset {
  private consumer: ContextConsumer<Context<unknown, DatasetCore | undefined>, ReactiveControllerHost & HTMLElement>
  private env: Environment
  #pointer!: AnyPointer

  /**
   * Initializes the Dataset controller for the host element.
   *
   * @param host The hosting LitElement / ReactiveControllerHost
   * @param callback Callback invoked whenever the ambient dataset changes
   */
  constructor(host: ReactiveControllerHost & HTMLElement, callback: (dataset: DatasetCore | undefined) => void) {
    this.env = new Environment(host, (env) => {
      this.#pointer = env.clownface()
    })
    this.consumer = new ContextConsumer(host, {
      context: dataset,
      callback: (dataset) => {
        this.#pointer = this.env.value.clownface({ dataset })
        callback(dataset)
      },
      subscribe: true,
    })
  }

  /**
   * The current DatasetCore instance from context.
   */
  get value(): DatasetCore | undefined {
    return this.consumer.value
  }

  /**
   * Clownface AnyPointer wrapping the current dataset using the ambient environment.
   */
  get pointer(): AnyPointer {
    return this.#pointer
  }
}
