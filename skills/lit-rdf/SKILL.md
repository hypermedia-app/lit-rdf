---
name: lit-rdf
description: Use when building or explaining RDF-driven Lit interfaces with lit-rdf, including dataset binding, focus-node context, graph traversal, filtering, sorting, and custom reactive components. Covers lit-rdf examples and integrations; excludes generic RDF processing and unrelated Lit components.
---

# Build with lit-rdf

Use the library's context providers and Clownface pointers to compose views. Preserve RDF terms and datasets through the binding layer instead of converting the graph into unrelated JSON models.

## Choose the example

- For initial setup, data sources, selecting resources, labels, links, and traversal, read [binding.md](references/binding.md).
- For repeated cards or tables, filters, sorting, custom controllers, and application updates, read [patterns.md](references/patterns.md).
- For a complete starting point, adapt [people-demo.ts](assets/people-demo.ts). It supplies its own RDF/JS fixture and renders a sorted, filtered list with per-person context. Import it from a browser TypeScript entrypoint with bare-module resolution, then place `<rdf-people-demo></rdf-people-demo>` in the page. It needs `lit`, `lit-rdf`, and `@zazuko/env`; it is not a standalone browser script.

## Binding contract

The usual hierarchy is `rdf-environment` → `rdf-dataset` → `target-node` → optional `filter-node` → a view consuming `FocusNode`. Contributing `rdf-graph` elements belong beneath the dataset. A custom view iterates `FocusNode.array` and wraps each item in `<focus-node .focusNode=${item}>` so nested resource elements consume that item.

`target-node`, `filter-node`, and `focus-node` provide context; they do not stamp one copy of their children per resource. Use an explicit renderer for collections. Traversal offers rendering callbacks, but those callbacks also need per-item `focus-node` wrappers when rendering nested resource elements.

Use attributes for serialized IRIs and paths, and Lit property bindings for objects and functions. Examples: `target-class="schema:Person"`, `.targetClass=${rdf.ns.schema.Person}`, `.value=${dataset}`, `.filter=${callback}`, `.focusNode=${pointer}`. Attribute converters do not run for property bindings.

Import `lit-rdf` for element registration; import controllers from `lit-rdf/controllers.js` and the environment mixin from `lit-rdf/mixins.js`. The root entrypoint does not export controller classes. Avoid private `src/` imports in consumer examples.

## Demonstrate the binding

Use the public exports supported by the installed version of `lit-rdf`.

Examples should include data matching their vocabulary, every required import, and a real collection renderer when multiple nodes are selected. Explain the expected visible output and how the dataset, focus, and nested bindings connect. These are display bindings; implement input-to-RDF writes explicitly when requested.
