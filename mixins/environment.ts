import {LitElementConstructor} from "../lib/constructor.js";
import {Environment, environment as context} from "../context.js";
import {consume, provide} from "@lit/context";
import {ssrConnectedCallback} from "../lib/ssrConnectedCallback.js";
import {state} from "lit/decorators.js";

export function consumeEnvironment<T extends LitElementConstructor>(base: T) {
    @ssrConnectedCallback()
    class Impl extends base {
        @consume({ context })
        rdf!: Environment
    }

    return Impl
}

export function provideEnvironment<T extends LitElementConstructor>(base: T) {
    @ssrConnectedCallback()
    class Impl extends base {
        @state()
        @provide({ context })
        rdf!: Environment
    }

    return Impl
}
