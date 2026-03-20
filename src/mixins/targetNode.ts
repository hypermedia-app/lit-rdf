import type { NamedNode } from '@rdfjs/types'
import { property, state } from 'lit/decorators.js'
import { provide } from '@lit/context'
import type { MultiPointer } from 'clownface'
import { focusNode } from '../context.js'
import { toNamedNode } from '../converter.js'
import type { LitElementConstructor, WithFocusNode } from '../constructor.js'
import { Environment } from '../controllers/Environment.js'
import { Graph } from '../controllers/Graph.js'

export interface WithTargets {
  targetObjectsOf: NamedNode | undefined
  targetSubjectsOf: NamedNode | undefined
  targetClass: NamedNode | undefined
  targetNode: NamedNode | undefined
}

export function provideTargetNode<T extends LitElementConstructor>(base: T) {
  class DataBound extends base {
    private readonly rdf: Environment
    private readonly graph: Graph

    constructor(...args: any[]) {
      super(...args)

      this.rdf = new Environment(this)
      this.graph = new Graph(this, () => {
        this.setFocusNode()
      })
    }

    @property({ type: Object, converter: toNamedNode, attribute: 'target-objects-of' })
    public targetObjectsOf: NamedNode | undefined

    @property({ type: Object, converter: toNamedNode, attribute: 'target-subjects-of' })
    public targetSubjectsOf: NamedNode | undefined

    @property({ type: Object, converter: toNamedNode, attribute: 'target-class' })
    public targetClass: NamedNode | undefined

    @property({ type: Object, converter: toNamedNode, attribute: 'target-node' })
    public targetNode: NamedNode | undefined

    @provide({ context: focusNode })
    @state()
    public focusNode: MultiPointer | undefined

    updated(changedProperties: Map<string, unknown>): void {
      if (changedProperties.has('targetNode') || changedProperties.has('targetClass') || changedProperties.has('targetSubjectsOf') || changedProperties.has('targetObjectsOf')) {
        this.setFocusNode()
      }
    }

    setFocusNode() {
      if (this.graph.value) {
        const found = this.findFocusNode()
        if (found?.terms.length) {
          this.focusNode = found
        }
      }
    }

    findFocusNode() {
      if (this.targetNode) {
        return this.graph.value?.node(this.targetNode)
      }

      if (this.targetClass) {
        return this.graph.value?.has(this.rdf.value.ns.rdf.type, this.targetClass)
      }

      if (this.targetSubjectsOf) {
        return this.graph.value?.in(this.targetSubjectsOf)
      }

      if (this.targetObjectsOf) {
        return this.graph.value?.out(this.targetObjectsOf)
      }

      return undefined
    }
  }

  return DataBound as T & LitElementConstructor<WithFocusNode & WithTargets>
}
