import type { ReactiveControllerHost } from 'lit'
import { type Context, ContextConsumer } from '@lit/context'
import * as context from '../context.js'

export class Environment<E extends context.Environment = context.Environment> {
  private consumer: ContextConsumer<Context<unknown, E | undefined>, ReactiveControllerHost & HTMLElement>

  constructor(host: ReactiveControllerHost & HTMLElement) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.consumer = new ContextConsumer(host, {
      context: context.environment,
    })
  }

  get value() {
    if (!this.consumer.value) {
      throw new Error('Environment not available. Make sure that a parent element is providing the environment.')
    }

    return this.consumer.value
  }
}
