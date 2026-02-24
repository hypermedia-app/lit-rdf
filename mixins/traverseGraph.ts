import {LitElementConstructor} from "../lib/constructor.js";
import {toPropertyPath} from "../lib/converter.js";
import {property} from "lit/decorators.js";
import {findNodes, ShaclPropertyPath} from "clownface-shacl-path";
import {consumeFocusNode} from "./focusNode.js";
import {MultiPointer} from "clownface";
import {provide} from "@lit/context";
import {focusNode as context} from "../context.js";
import {PropertyValues} from "lit";

export function traverseGraph<T extends LitElementConstructor>(Base: T) {
    class TraverseGraph extends consumeFocusNode(Base) {
        @property({ type: Object, converter: toPropertyPath, attribute: 'property-path' })
        propertyPath: ShaclPropertyPath | undefined

        @provide({ context })
        @property()
        objectNode: MultiPointer | undefined

        willUpdate(_changedProperties: PropertyValues) {
            if (_changedProperties.has('focusNode') || _changedProperties.has('propertyPath')) {
                this.setObjectNode()
            }
        }

        setObjectNode() {
            if (this.propertyPath && this.focusNode) {
                this.objectNode = findNodes(this.focusNode, this.propertyPath)
            }
        }
    }

    return TraverseGraph
}
