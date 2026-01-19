import {css, html, LitElement} from "lit";
import {customElement, property} from "lit/decorators.js";
import {provideTargetNode} from "../mixins/targetNode";
import {NamedNode} from "@rdfjs/types";
import {toNamedNode} from "../lib/converter";
import {provide} from "@lit/context";
import {sortCriteria} from "../context";

@customElement('target-node')
export default class extends provideTargetNode(LitElement) {
    static styles = css`
        :host {
            display: contents !important;
        }
    `

    @property({ type: Object, attribute: 'order-by', converter: toNamedNode })
    @provide({ context: sortCriteria })
    orderBy: NamedNode | undefined

    render() {
        return html`<slot></slot>`;
    }
}
