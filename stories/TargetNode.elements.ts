import { html, LitElement } from 'lit'
import { shrink } from '@zazuko/prefixes'
import { FocusNode } from '../src/controllers.js'
import '../src/components/focus-node.js'
import '../src/components/resource-label.js'
import '../src/components/resource-value.js'
import '../src/components/traverse-graph.js'
import { repeat } from 'lit/directives/repeat.js'

class VocabularyTable extends LitElement {
  private focusNode: FocusNode

  static properties = {
    additionalProps: {
      type: Array,
      attribute: 'additional-props',
    },
  }

  declare additionalProps: string[]

  constructor() {
    super()
    this.focusNode = new FocusNode(this)
    this.additionalProps = []
  }

  protected render(): unknown {
    return html`
      <table>
        <thead>
        <tr>
          <td>Term</td>
          <td>Label</td>
          <td>Comment</td>
          ${this.additionalProps.map(prop => html`<td>${prop}</td>`)}
        </tr>
        </thead>
        <tbody>
        ${this.focusNode.array?.map(item => html`
          <tr>
            <td>${shrink(item.value) || item.value}</td>
            <td>
              <focus-node .focusNode="${item}">
                <resource-label predicate="rdfs:label">
                </resource-label>
              </focus-node>
            </td>
            <td>
              <focus-node .focusNode="${item}">
                <resource-label predicate="rdfs:comment">
                </traverse-graph>
              </focus-node>
            </td>
            ${repeat(this.additionalProps, prop => prop + item.value, prop => html`
                <td>
                  <focus-node .focusNode="${item}">
                    <traverse-graph property-path="${prop}">
                      <resource-value></resource-value>
                    </focus-node>
                  </td>
            `)}
          </tr>`)}
        </tbody>
      </table>`
  }
}

customElements.define('vocabulary-table', VocabularyTable)
