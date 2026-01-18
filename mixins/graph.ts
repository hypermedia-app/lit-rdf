import {Constructor} from "../lib/constructor.js";
import {LitElement} from "lit";
import {AnyPointer} from "clownface";
import {consume, provide} from "@lit/context";
import {dataset, Environment} from "../context.js";
import {ssrConnectedCallback} from "../lib/ssrConnectedCallback.js";
import {state} from "lit/decorators.js";

export function provideGraph<T extends LitElement>(base: Constructor<T>) {
    @ssrConnectedCallback()
    // @ts-ignore
    class WithGraphProvider extends base {
        @provide({ context: dataset })
        @state()
        graph: AnyPointer | undefined
    }

    return WithGraphProvider
}

export function consumeGraph<T extends LitElement>(base: Constructor<T>) {
    @ssrConnectedCallback()
    // @ts-ignore
    class WithGraphConsumer extends base {
        @consume({ context: dataset, subscribe: true })
        @state()
        graph: AnyPointer | undefined
    }

    return WithGraphConsumer
}
