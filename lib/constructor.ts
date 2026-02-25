import type { LitElement } from 'lit'

export type Constructor<T = unknown> = new (...args: unknown[]) => T;

export type LitElementConstructor<T extends LitElement = LitElement> = Constructor<T>;
