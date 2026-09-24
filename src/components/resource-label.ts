import { html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import type { NamedNode } from '@rdfjs/types'
import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel.js'
import rdf from '@rdfjs/data-model'
import { toNamedNode } from '../converter.js'
import { FocusNode } from '../controllers/FocusNode.js'

/**
 * An element that renders a human-readable, localized label for the current focus node.
 *
 * @summary Renders a localized label for the current focus node.
 * @tag resource-label
 */
@customElement('resource-label')
export class ResourceLabel extends LitElement {
  /**
   * The RDF predicate used to look up the label property.
   * @default rdfs:label (http://www.w3.org/2000/01/rdf-schema#label)
   */
  @property({ type: Object, converter: toNamedNode })
  public predicate: NamedNode = rdf.namedNode('http://www.w3.org/2000/01/rdf-schema#label')

  private readonly focusNode: FocusNode

  constructor() {
    super()

    this.focusNode = new FocusNode(this)
  }

  render() {
    if (!this.focusNode.pointer) {
      return html``
    }

    const fallback = this.focusNode.pointer.out(this.predicate).value

    return html`${localizedLabel(this.focusNode.pointer, { property: this.predicate, fallback })}`
  }
}
