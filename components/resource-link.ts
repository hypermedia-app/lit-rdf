import {html, LitElement} from "lit";
import {customElement, property} from "lit/decorators.js";
import {consumeFocusNode} from "../mixins/focusNode.js";
import {NamedNode} from "@rdfjs/types";
import {toNamedNode, toPropertyPath} from "../lib/converter.js";
import {findNodes} from "clownface-shacl-path";

@customElement('resource-link')
export class ResourceLink extends consumeFocusNode(LitElement) {
    @property({type: Object, converter: toPropertyPath})
    property?: NamedNode

    render() {
        if (!this.focusNode) {
            return html`
                <slot></slot>`
        }

        let href

        if (this.property) {
            href = findNodes(this.focusNode, this.property).value
        }

        if (!href) {
            href = this.focusNode.value
        }

        return html`<a href="${href}">
            <slot></slot>
        </a>`
    }
}
