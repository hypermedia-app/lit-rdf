import { createContext } from '@lit/context'
import {AnyPointer, MultiPointer} from "clownface";
import {DefaultEnv} from '@zazuko/env'

export type Environment = DefaultEnv

export const environment = createContext<Environment>(Symbol('environment'));
export const dataset = createContext<AnyPointer | undefined>(Symbol('dataset'));
export const focusNode = createContext<MultiPointer | undefined>(Symbol('focus-node'));
