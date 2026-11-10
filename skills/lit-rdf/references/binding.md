# Declarative binding

## Supply data and select one resource

This is a complete Lit render function for a browser application with package imports resolved by its build tool:

```ts
import { html, render } from 'lit'
import rdf from '@zazuko/env/web.js'
import 'lit-rdf'

const alice = rdf.namedNode('https://example.org/alice')
const dataset = rdf.dataset([
  rdf.quad(alice, rdf.ns.rdf.type, rdf.ns.schema.Person),
  rdf.quad(alice, rdf.ns.schema.name, rdf.literal('Alice')),
  rdf.quad(alice, rdf.ns.schema.url, rdf.namedNode('https://alice.example.org/')),
])

render(html`
  <rdf-environment>
    <rdf-dataset .value=${dataset}>
      <target-node target-node="https://example.org/alice">
        <h2><resource-label predicate="schema:name"></resource-label></h2>
        <resource-link property="schema:url">Homepage</resource-link>
      </target-node>
    </rdf-dataset>
  </rdf-environment>
`, document.body)
```

Expected output: a heading “Alice” and a “Homepage” anchor linking to `https://alice.example.org/`. The environment supplies RDF factories; the dataset supplies the graph; the target supplies a Clownface pointer; resource elements consume that pointer.

`resource-label` defaults to `rdfs:label`. Specify `predicate="schema:name"` for schema names; there is no automatic fallback across arbitrary label predicates. `resource-link` uses the focus URI when `property` is absent or resolves no value. Supply its visible content in the default slot. `resource-value` displays the current pointer's raw `.value`; it has no predicate lookup or datatype formatting API.

## Compose graph sources

Use either a dataset bound directly to `rdf-dataset.value`, as above, or child graph contributions:

```ts
html`
  <rdf-environment>
    <rdf-dataset>
      <rdf-graph .value=${peopleDataset}></rdf-graph>
      <rdf-graph .value=${labelsDataset}
        graph="https://example.org/graphs/labels"></rdf-graph>
      <!-- Put selection and view components here. -->
    </rdf-dataset>
  </rdf-environment>
`
```

Here `peopleDataset` and `labelsDataset` are RDF/JS DatasetCore objects, not strings. Graph contributions are merged; without a `graph` override their existing quad graph terms are preserved. Setting `graph` rewrites all contributed quads to that named graph. Graph contribution updates rebuild `rdf-dataset.value`, so avoid treating its direct value binding as an additional independently merged source.

`rdf-graph` has no `src` URL loader or inline Turtle parser. Fetch/parse RDF in application code, then bind the resulting dataset. Its `window.graphs` lookup is an optional preloaded factory mechanism keyed by `data-graph` or `id`, not a network loader. The current update hook watches `value`; changing only `graph` does not resubmit the contribution.

## Select focus nodes

| Attribute            | Property binding type           | Meaning                           |
|----------------------|---------------------------------|-----------------------------------|
| `target-node`        | `.targetNode` = NamedNode or GraphPointer       | Explicit resource                 |
| `target-class`       | `.targetClass` = NamedNode or GraphPointer      | Subjects with matching `rdf:type` |
| `target-subjects-of` | `.targetSubjectsOf` = NamedNode or GraphPointer | Subjects of a predicate           |
| `target-objects-of`  | `.targetObjectsOf` = NamedNode or GraphPointer  | Objects of a predicate            |

All four target properties accept a Clownface `GraphPointer` as well as a `NamedNode`; for example, `.targetClass=${typePointer}`. A pointer supplies its RDF term to the selector, while selection still reads the surrounding `rdf-dataset`; it does not replace that dataset with the pointer's dataset. Attribute bindings remain serialized IRIs or CURIEs.

Use one selector per element. If several are set, the implementation chooses in the table's order; it does not combine them. Prefixed attributes use the library's known prefixes. Use a full IRI or a NamedNode property binding for application vocabularies; declaring a prefix in Turtle does not register it with attribute converters.

## Traverse from a single resource

Inside a per-resource focus, a single-valued property can be displayed as:

```ts
html`
  <traverse-graph property-path="foaf:age">
    <resource-value></resource-value>
    <span slot="empty">Age unknown</span>
  </traverse-graph>
`
```

`property-path` is parsed as a SPARQL/SHACL path. For example, `schema:knows/schema:name` follows friends to their names, and `^schema:knows` follows incoming relationships. A `.propertyPath` binding expects the parsed SHACL path object, not the serialized string.

For multiple results, choose a callback rather than relying on the `.value` of a multi-pointer:

```ts
import type { GraphPointer } from 'clownface'

html`
  <traverse-graph property-path="schema:knows"
    .renderObjectNode=${(friend: GraphPointer) => html`
      <focus-node .focusNode=${friend}>
        <p><resource-label predicate="schema:name"></resource-label></p>
      </focus-node>
    `}>
    <p slot="empty">No friends listed</p>
  </traverse-graph>
`
```

The default slot receives the entire resulting pointer, not one scoped pointer per child. `.renderObjectNodes` receives the whole multi-pointer and takes precedence over `.renderObjectNode`. Neither callback applies the ambient sort automatically.

Current implementation caveat: `traverse-graph.willUpdate` checks a `focusNode` changed-property key, while its controller calls `requestUpdate()` without that key. Initial property-path rendering is supported, but a later focus-only change may leave traversal stale. For dynamic views, derive related values directly from the current `GraphPointer` inside the collection renderer, as the demo does, or verify a library fix before relying on reactive traversal.
