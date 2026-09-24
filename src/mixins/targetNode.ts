import type { NamedNode } from '@rdfjs/types'
import { property, state } from 'lit/decorators.js'
import { provide } from '@lit/context'
import type { MultiPointer } from 'clownface'
import { focusNode } from '../context.js'
import { toNamedNode } from '../converter.js'
import type { LitElementConstructor, WithFocusNode } from '../constructor.js'
import { Environment } from '../controllers/Environment.js'
import { Graph } from '../controllers/Graph.js'

/**
 * Interface representing target selection properties.
 */
export interface WithTargets {
  /** Target nodes that are objects of the specified predicate. */
  targetObjectsOf: NamedNode | undefined
  /** Target nodes that are subjects of the specified predicate. */
  targetSubjectsOf: NamedNode | undefined
  /** Target instances of the specified RDF/RDFS/OWL/SHACL class. */
  targetClass: NamedNode | undefined
  /** Explicit target node URI. */
  targetNode: NamedNode | undefined
}

/**
 * Mixin that adds RDF target node resolution capabilities to a Lit element.
 * Resolves focus nodes from the ambient graph context based on targeting criteria and
 * provides the resulting focus node multi-pointer to descendants.
 *
 * @param base Base LitElement constructor class
 * @returns Enhanced class providing target node resolution
 */
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

    /**
     * Target nodes that are objects of the specified predicate URI.
     */
    @property({ type: Object, converter: toNamedNode, attribute: 'target-objects-of' })
    public targetObjectsOf: NamedNode | undefined

    /**
     * Target nodes that are subjects of the specified predicate URI.
     */
    @property({ type: Object, converter: toNamedNode, attribute: 'target-subjects-of' })
    public targetSubjectsOf: NamedNode | undefined

    /**
     * Target nodes that are instances of the specified class URI (via `rdf:type`).
     */
    @property({ type: Object, converter: toNamedNode, attribute: 'target-class' })
    public targetClass: NamedNode | undefined

    /**
     * Target node URI to select directly.
     */
    @property({ type: Object, converter: toNamedNode, attribute: 'target-node' })
    public targetNode: NamedNode | undefined

    /**
     * The resolved clownface focus node(s) provided in context.
     */
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
