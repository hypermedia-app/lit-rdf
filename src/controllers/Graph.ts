import type { Context } from '@lit/context'
import { ContextConsumer } from '@lit/context'
import type { ReactiveControllerHost } from 'lit'
import type { AnyPointer } from 'clownface'
import { dataset } from '../context.js'

export class Graph {
  private consumer: ContextConsumer<Context<unknown, AnyPointer>, ReactiveControllerHost & HTMLElement>

  constructor(host: ReactiveControllerHost & HTMLElement, callback?: (value: AnyPointer | undefined) => void) {
    this.consumer = new ContextConsumer(host, {
      context: dataset,
      subscribe: true,
      callback,
    })
  }

  get value() {
    return this.consumer.value
  }
}
