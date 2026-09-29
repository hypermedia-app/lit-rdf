import type { ReactiveControllerHost } from 'lit'
import { type Context, ContextConsumer } from '@lit/context'
import type { DatasetCore } from '@rdfjs/types'
import type { AnyPointer } from 'clownface'
import { dataset } from '../context.js'
import { Environment } from './Environment.js'

export class Dataset {
  private consumer: ContextConsumer<Context<unknown, DatasetCore | undefined>, ReactiveControllerHost & HTMLElement>
  private env: Environment
  #pointer!: AnyPointer

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

  get value(): DatasetCore | undefined {
    return this.consumer.value
  }

  get pointer(): AnyPointer {
    return this.#pointer
  }
}
