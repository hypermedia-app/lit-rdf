import {ComplexAttributeConverter} from "lit";
import {NamedNode} from "@rdfjs/types";
import isUrl from "is-url";
import rdf from "@rdfjs/data-model";
import {expand, shrink} from "@zazuko/prefixes";
import { parse } from "sparql-path-parser";
import type { ShaclPropertyPath } from 'clownface-shacl-path';

export const toNamedNode: ComplexAttributeConverter = {
    fromAttribute(value: string | null): NamedNode {
        if (typeof value === 'undefined' || value === null) {
            throw new Error('NamedNode converter: value is null')
        }

        if(isUrl(value)) {
            return rdf.namedNode(value as string)
        }
        return rdf.namedNode(expand(value))
    },
    toAttribute({value}: NamedNode): string {
        return shrink(value)
    }
}

export const toPropertyPath: ComplexAttributeConverter = {
    fromAttribute(value: string | null, type?: unknown): ShaclPropertyPath {
        if (typeof value === 'undefined' || value === null) {
            throw new Error('PropertyPath converter: value is null')
        }

        return parse(value)
    }
}
