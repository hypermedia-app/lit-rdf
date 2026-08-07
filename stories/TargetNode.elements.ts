import { html, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'
import { shrink } from '@zazuko/prefixes'
import { FocusNode } from '../src/controllers.js'
import '../src/components/focus-node.js'
import '../src/components/resource-label.js'

@customElement('vocabulary-table')
class VocabularyTable extends LitElement {
  private focusNode: FocusNode

  constructor() {
    super()
    this.focusNode = new FocusNode(this)
  }

  protected render(): unknown {
    return html`
      <table>
        <thead>
        <tr>
          <td>Term</td>
          <td>Label</td>
          <td>Comment</td>
        </tr>
        </thead>
        <tbody>
        ${this.focusNode.array?.map((item) =>
    html`
            <tr>
              <td>${shrink(item.value)}</td>
              <td>
                <focus-node .focusNode=${item}>
                <resource-label predicate="rdfs:label">
                </resource-label>
                </focus-node>
              </td>
              <td>
                <focus-node .focusNode=${item}>
                  <resource-label predicate="rdfs:comment">
                  </resource-label>
                </focus-node>
              </td>
            </tr>`)}
        </tbody>
      </table>`
  }
}
