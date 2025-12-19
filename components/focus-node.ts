import {html, LitElement} from "lit";
import {customElement, state} from "lit/decorators.js";
import {provide} from "@lit/context";
import {focusNode as context} from "../context.js";
import {MultiPointer} from "clownface";

@customElement('focus-node')
export default class extends LitElement {
    @provide({ context })
    @state()
    focusNode: MultiPointer | undefined

    render() {
        return html`<slot></slot>`;
    }
}
