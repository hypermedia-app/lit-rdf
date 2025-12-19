import {html, LitElement} from "lit";
import {consume} from "@lit/context";
import {dataset} from "../context.js";
import {AnyPointer} from "clownface";
import {customElement, state} from "lit/decorators.js";
import {consumeEnvironment} from "../mixins/environment.js";
import { provideGraph} from "../mixins/graph.js";

@customElement('data-graph')
export default class extends provideGraph(consumeEnvironment(LitElement)) {
    @consume({context: dataset, subscribe: true})
    @state()
    parent: AnyPointer | undefined

    protected render(): unknown {
        return html`
            <slot></slot>`
    }
}
