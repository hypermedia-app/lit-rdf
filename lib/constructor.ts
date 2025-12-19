import {LitElement} from "lit";

export type Constructor<T = {}> = new (...args: any[]) => T;

export type LitElementConstructor = Constructor<LitElement>;
