import { html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import type { NamedNode } from '@rdfjs/types'
import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel.js'
import rdf from '@rdfjs/data-model'
import { consumeFocusNode } from '../mixins/focusNode.js'
import { toNamedNode } from '../converter.js'

@customElement('resource-label')
export class ResourceLabel extends consumeFocusNode(LitElement) {
  @property({ type: Object, converter: toNamedNode })
  public property: NamedNode = rdf.namedNode('http://www.w3.org/2000/01/rdf-schema#label')

  render() {
    if (!this.focusNode) {
      return html``
    }

    return html`${localizedLabel(this.focusNode, { property: this.property })}`
  }
}
