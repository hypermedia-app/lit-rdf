import type { NamedNode } from '@rdfjs/types'
import { property, state } from 'lit/decorators.js'
import type { LitElement, PropertyValues } from 'lit'
import { provide } from '@lit/context'
import type { MultiPointer } from 'clownface'
import { focusNode } from '../context.js'
import { toNamedNode } from '../lib/converter.js'
import type { Constructor } from '../lib/constructor.js'
import { consumeEnvironment } from './environment.js'
import { consumeGraph } from './graph.js'

export function provideTargetNode<T extends LitElement = LitElement>(base: Constructor<T>) {
  class DataBound extends consumeGraph(consumeEnvironment(base)) {
    @property({ type: Object, converter: toNamedNode, attribute: 'target-objects-of' })
    public targetObjectsOf: NamedNode | undefined

    @property({ type: Object, converter: toNamedNode, attribute: 'target-subjects-of' })
    public targetSubjectsOf: NamedNode | undefined

    @property({ type: Object, converter: toNamedNode, attribute: 'target-class' })
    public targetClass: NamedNode | undefined

    @provide({ context: focusNode })
    @state()
    public focusNode: MultiPointer | undefined

    protected willUpdate(_changedProperties: PropertyValues) {
      if (_changedProperties.has('graph')) {
        this.setFocusNode()
      }
    }

    protected updated(_changedProperties: PropertyValues) {
      if (_changedProperties.has('graph')) {
        this.setFocusNode()
      }
    }

    setFocusNode() {
      if (this.graph) {
        const found = this.findFocusNode()
        if (found?.terms.length) {
          this.focusNode = found
        }
      }
    }

    findFocusNode() {
      if (this.targetClass) {
        return this.graph?.has(this.rdf.ns.rdf.type, this.targetClass)
      }

      if (this.targetSubjectsOf) {
        return this.graph?.in(this.targetSubjectsOf)
      }

      if (this.targetObjectsOf) {
        return this.graph?.out(this.targetObjectsOf)
      }

      return undefined
    }
  }

  return DataBound
}
