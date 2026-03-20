import { html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import type { NamedNode } from '@rdfjs/types'
import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel.js'
import rdf from '@rdfjs/data-model'
import { toNamedNode } from '../converter.js'
import { FocusNode } from '../controllers/FocusNode.js'

@customElement('resource-label')
export class ResourceLabel extends LitElement {
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

    return html`${localizedLabel(this.focusNode.pointer, { property: this.predicate })}`
  }
}
