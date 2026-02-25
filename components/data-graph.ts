import { html, LitElement } from 'lit'
import { consume } from '@lit/context'
import type { AnyPointer } from 'clownface'
import { customElement, state } from 'lit/decorators.js'
import { dataset } from '../context.js'
import { consumeEnvironment } from '../mixins/environment.js'
import { provideGraph } from '../mixins/graph.js'

@customElement('data-graph')
export default class extends provideGraph(consumeEnvironment(LitElement)) {
  @consume({ context: dataset, subscribe: true })
  @state()
  public parent: AnyPointer | undefined

  render(): unknown {
    return html`
            <slot></slot>`
  }
}
