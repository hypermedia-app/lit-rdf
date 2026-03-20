import type { ReactiveControllerHost } from 'lit'
import type { Context } from '@lit/context'
import { ContextConsumer } from '@lit/context'
import type { GraphPointer, MultiPointer } from 'clownface'
import { focusNode, sortCriteria } from '../context.js'

export class FocusNode {
  private focusNodeConsumer: ContextConsumer<Context<unknown, MultiPointer | undefined>, ReactiveControllerHost & HTMLElement>
  private sortCriteriaConsumer

  constructor(host: ReactiveControllerHost & HTMLElement) {
    this.focusNodeConsumer = new ContextConsumer(host, {
      context: focusNode,
      subscribe: true,
      callback() {
        host.requestUpdate()
      },
    })

    this.sortCriteriaConsumer = new ContextConsumer(host, {
      context: sortCriteria,
      subscribe: true,
      callback() {
        host.requestUpdate()
      },
    })
  }

  get pointer(): MultiPointer | undefined {
    return this.focusNodeConsumer.value
  }

  get array(): GraphPointer[] | undefined {
    const array = this.pointer?.toArray()
    const sortPredicate = this.sortCriteriaConsumer.value

    if (!array || !sortPredicate) {
      return array
    }

    return array.sort((left, right) => {
      return left.out(sortPredicate).value?.localeCompare(right.out(sortPredicate).value || '') || 0
    })
  }
}
