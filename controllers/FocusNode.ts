import {ReactiveController, ReactiveControllerHost} from "lit";
import {Context, ContextConsumer} from "@lit/context";
import {GraphPointer, MultiPointer} from "clownface";
import {focusNode, sortCriteria} from "../context.js";

// @ts-ignore
export class FocusNode implements ReactiveController {
    private focusNodeConsumer: ContextConsumer<Context<unknown, MultiPointer | undefined>, ReactiveControllerHost & HTMLElement>;
    private sortCriteriaConsumer

    constructor(host: ReactiveControllerHost & HTMLElement) {
        this.focusNodeConsumer = new ContextConsumer(host, {
            context: focusNode,
            subscribe: true,
        })

        this.sortCriteriaConsumer = new ContextConsumer(host, {
            context: sortCriteria,
            subscribe: true,
        })
    }

    get pointer(): MultiPointer | undefined {
        return this.focusNodeConsumer.value;
    }

    get array(): GraphPointer[] | undefined {
        const array =  this.pointer?.toArray()
        const sortPredicate  = this.sortCriteriaConsumer.value;

        if (!array || !sortPredicate) {
            return array;
        }

        return array.sort((left, right) => {
            return left.out(sortPredicate).value?.localeCompare(right.out(sortPredicate).value || '') || 0;
        })
    }
}
