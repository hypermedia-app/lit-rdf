import { css, html, LitElement } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { provide } from '@lit/context'
import type { MultiPointer } from 'clownface'
import type { NamedNode } from '@rdfjs/types'
import { toNamedNode, toSortPredicate } from '../converter.js'
import type { SortPredicate } from '../context.js'
import { focusNode, sortDirection, sortPredicate } from '../context.js'
import { Dataset } from '../controllers/Dataset.js'
import { Environment } from '../controllers/Environment.js'

/**
 * An element that selects focus nodes from the RDF graph based on criteria such as
 * target node URI, target class, subjects of a predicate, or objects of a predicate,
 * with optional sorting support.
 *
 * @summary Selects and provides focus nodes from the RDF graph.
 * @tag target-node
 * @slot - Default slot for child elements consuming the targeted focus nodes.
 */
@customElement('target-node')
export default class TargetNode extends LitElement {
  static styles = css`
        :host {
            display: contents !important;
        }
    `
  private readonly rdf: Environment
  private readonly graph: Dataset

  /**
   * Sort predicate or property URI used to order targeted nodes.
   */
  @property({ type: Object, attribute: 'order-by', converter: toSortPredicate })
  @provide({ context: sortPredicate })
  public orderBy: SortPredicate | undefined

  /**
   * Sort direction ('asc' for ascending, 'desc' for descending).
   * @default 'asc'
   */
  @property({ type: String, attribute: 'order-dir', reflect: true })
  @provide({ context: sortDirection })
  public orderDir: 'asc' | 'desc' = 'asc'

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

  constructor() {
    super()

    this.rdf = new Environment(this)
    this.graph = new Dataset(this, () => {
      this.setFocusNode()
    })
  }

  render() {
    return html`<slot></slot>`
  }

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
      return this.graph.pointer.node(this.targetNode)
    }

    if (this.targetClass) {
      return this.graph.pointer.has(this.rdf.value.ns.rdf.type, this.targetClass)
    }

    if (this.targetSubjectsOf) {
      return this.graph.pointer.in(this.targetSubjectsOf)
    }

    if (this.targetObjectsOf) {
      return this.graph.pointer.out(this.targetObjectsOf)
    }

    return undefined
  }
}
