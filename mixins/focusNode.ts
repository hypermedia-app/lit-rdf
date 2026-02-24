import {LitElementConstructor} from "../lib/constructor.js";
import {consume} from "@lit/context";
import {focusNode as context} from "../context.js";
import {MultiPointer} from "clownface";
import {consumeEnvironment} from "./environment.js";

export function consumeFocusNode<T extends LitElementConstructor>(base: T) {
    class Impl extends consumeEnvironment(base) {
        @consume({ context, subscribe: true })
        focusNode!: MultiPointer | undefined
    }

    return Impl
}
