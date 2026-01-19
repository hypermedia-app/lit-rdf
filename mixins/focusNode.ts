import {LitElementConstructor} from "../lib/constructor.js";
import {ssrConnectedCallback} from "../lib/ssrConnectedCallback.js";
import {consume, Context} from "@lit/context";
import {focusNode as context} from "../context.js";
import {GraphPointer, MultiPointer} from "clownface";
import {consumeEnvironment} from "./environment";
import {ReactiveController, ReactiveControllerHost} from "lit";
import {ContextConsumer} from '@lit/context';

export function consumeFocusNode<T extends LitElementConstructor>(base: T) {
    @ssrConnectedCallback()
    class Impl extends consumeEnvironment(base) {
        @consume({ context, subscribe: true })
        focusNode!: MultiPointer | undefined
    }

    return Impl
}
