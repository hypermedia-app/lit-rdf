import {LitElementConstructor} from "../lib/constructor.js";
import {ssrConnectedCallback} from "../lib/ssrConnectedCallback.js";
import {consume} from "@lit/context";
import {focusNode as context} from "../context.js";
import {MultiPointer} from "clownface";
import {consumeEnvironment} from "./environment";

export function consumeFocusNode<T extends LitElementConstructor>(base: T) {
    @ssrConnectedCallback()
    class Impl extends consumeEnvironment(base) {
        @consume({ context, subscribe: true })
        focusNode!: MultiPointer | undefined
    }

    return Impl
}
