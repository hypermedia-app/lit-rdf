import { LitElement } from 'lit'
import { FocusNode } from 'lit-rdf/controllers.js'
import { customElement } from 'lit/decorators.js'

/**
 * An element that formats and displays the value of the current focus node.
 *
 * @summary Displays the value of the current focus node.
 * @tag resource-value
 */
@customElement('resource-value')
export default class ResourceValue extends LitElement {
  private readonly focusNode: FocusNode

  constructor() {
    super()

    this.focusNode = new FocusNode(this)
  }

  render() {
    return this.focusNode.pointer?.value
  }
}
