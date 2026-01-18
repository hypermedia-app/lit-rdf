import {css, html, LitElement} from "lit";
import {customElement} from "lit/decorators.js";
import {provideTargetNode} from "../mixins/targetNode";

@customElement('target-node')
export default class extends provideTargetNode(LitElement) {
    static styles = css`
        :host {
            display: contents !important;
        }
    `

    render() {
        return html`<slot></slot>`;
    }
}
