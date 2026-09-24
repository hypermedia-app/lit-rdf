import type { ReactiveControllerHost } from 'lit'
import type { Context } from '@lit/context'
import { ContextConsumer } from '@lit/context'
import type { GraphPointer, MultiPointer } from 'clownface'
import { focusNode, sortPredicate, sortDirection } from '../context.js'
import { sort } from '../sort.js'

export { sort } from '../sort.js'

/**
 * Reactive controller for consuming and managing the current focus node context,
 * with automatic subscription to sorting criteria and sort direction.
 */
export class FocusNode {
  private focusNodeConsumer: ContextConsumer<Context<unknown, MultiPointer | undefined>, ReactiveControllerHost & HTMLElement>
  private sortPredicateConsumer
  private sortDirectionConsumer

  /**
   * Optional callback invoked whenever the focus node or sorting context changes.
   */
  public onChange?: () => void

  /**
   * Initializes the FocusNode controller for the host element.
   *
   * @param host The hosting LitElement / ReactiveControllerHost
   */
  constructor(host: ReactiveControllerHost & HTMLElement) {
    this.focusNodeConsumer = new ContextConsumer(host, {
      context: focusNode,
      subscribe: true,
      callback: () => {
        host.requestUpdate()
        this.onChange?.()
      },
    })

    this.sortPredicateConsumer = new ContextConsumer(host, {
      context: sortPredicate,
      subscribe: true,
      callback: () => {
        host.requestUpdate()
        this.onChange?.()
      },
    })

    this.sortDirectionConsumer = new ContextConsumer(host, {
      context: sortDirection,
      subscribe: true,
      callback: () => {
        host.requestUpdate()
        this.onChange?.()
      },
    })
  }

  /**
   * Gets the current clownface multi-pointer focus node from context.
   */
  get pointer(): MultiPointer | undefined {
    return this.focusNodeConsumer.value
  }

  /**
   * Returns the focus nodes as a sorted array of graph pointers based on active sort context.
   */
  get array(): GraphPointer[] | undefined {
    const array = this.pointer?.toArray()
    const sortPredicateFunc = this.sortPredicateConsumer.value
    const sortDirectionValue = this.sortDirectionConsumer.value

    if (!array || !sortPredicateFunc) {
      return array
    }

    return array.sort(sort(sortPredicateFunc, sortDirectionValue))
  }
}
