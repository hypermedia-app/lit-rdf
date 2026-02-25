import { html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import type { NamedNode } from '@rdfjs/types'
import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel.js'
import { consumeFocusNode } from '../mixins/focusNode.js'
import { toNamedNode } from '../lib/converter.js'

@customElement('resource-label')
export class ResourceLabel extends consumeFocusNode(LitElement) {
  @property({ type: Object, converter: toNamedNode })
    property?: NamedNode

  render() {
    if (!this.focusNode) {
      return html``
    }

    return html`${localizedLabel(this.focusNode, { property: this.property })}`
  }
}
