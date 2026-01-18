import {css, html, LitElement} from "lit";
import {customElement, property} from "lit/decorators.js";
import {traverseGraph} from "../mixins/traverseGraph.js";
import {GraphPointer, MultiPointer} from "clownface";

@customElement('traverse-graph')
export default class extends traverseGraph(LitElement) {
    static styles = css`
        :host {
            display: contents;
        }
    `

    @property({ type: Object})
    renderObjectNode?: (node: GraphPointer) => unknown

    @property({ type: Object})
    renderObjectNodes?: (nodes: MultiPointer) => unknown

    render() {
        if(!this.objectNode || this.objectNode.terms.length === 0) {
            return html`<slot name="empty"></slot>`;
        }

        if(this.renderObjectNodes) {
            return this.renderObjectNodes(this.objectNode);
        }

        if (this.renderObjectNode) {
            return html`${this.objectNode.map(node => this.renderObjectNode!(node))}`;
        }

        return html`<slot></slot>`;
    }
}
