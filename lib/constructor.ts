import type { LitElement } from 'lit'

export type LitElementConstructor<T extends LitElement = LitElement> = new (...args: any[]) => T;
