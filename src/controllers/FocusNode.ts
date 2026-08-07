import type { ReactiveControllerHost } from 'lit'
import type { Context } from '@lit/context'
import { ContextConsumer } from '@lit/context'
import type { GraphPointer, MultiPointer } from 'clownface'
import { focusNode, sortPredicate, sortDirection } from '../context.js'

export class FocusNode {
  private focusNodeConsumer: ContextConsumer<Context<unknown, MultiPointer | undefined>, ReactiveControllerHost & HTMLElement>
  private sortPredicateConsumer
  private sortDirectionConsumer

  constructor(host: ReactiveControllerHost & HTMLElement) {
    this.focusNodeConsumer = new ContextConsumer(host, {
      context: focusNode,
      subscribe: true,
      callback() {
        host.requestUpdate()
      },
    })

    this.sortPredicateConsumer = new ContextConsumer(host, {
      context: sortPredicate,
      subscribe: true,
      callback() {
        host.requestUpdate()
      },
    })

    this.sortDirectionConsumer = new ContextConsumer(host, {
      context: sortDirection,
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
    const sortPredicateFunc = this.sortPredicateConsumer.value
    const sortDirectionValue = this.sortDirectionConsumer.value

    if (!array || !sortPredicateFunc) {
      return array
    }

    return array.sort((left, right) => {
      if (sortDirectionValue === 'desc') {
        return sortPredicateFunc(right)?.localeCompare(sortPredicateFunc(left) || '') || 0
      }

      return sortPredicateFunc(left)?.localeCompare(sortPredicateFunc(right) || '') || 0
    })
  }
}
