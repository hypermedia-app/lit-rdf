# lit-rdf

## 0.3.3

### Patch Changes

- 3b452a8: Remove unused direct dependency `rdf-canonize`
- 3b452a8: Update `@zazuko/env` to `^3.0.4`.
- 5a504bc: Made `@zazuko/prefixes` a peer dependency
- 3b452a8: Add a repository AI skill demonstrating lit-rdf data binding, filtering, sorting, and custom component patterns, with an interactive example and contributor guidance.

## 0.3.2

### Patch Changes

- ee852da: Allow both `[id]` and `[data-attribute]` to select the graph from `window.graphs`
- ee852da: `rdf-graph` should not rely on RDF environment so that populating data from `window.graphs` is as fast as possible

## 0.3.1

### Patch Changes

- 248eebf: No actual `custom-elements.js` module caused issues at runtime
- 7a53892: `rdf-graph` now initializes itself from 'window.graphs`
- 7a53892: Removed `data-graph.js` (technically breaking change but the script does not work in 4.0 anyway)

## 0.3.0

### Minor Changes

- 78012d0: Removed mixins `provideDataset`, `provideGraph`, `provideTargetNode` and `traverseGraph`. Their functionality is now provided by the respective elements.
- 78012d0: Removed `data-graph` and introduced `rdf-dataset` and `rdf-graph` instead

### Patch Changes

- b3e31ed: Added `<filter-node>` element

## 0.2.2

### Patch Changes

- af27103: Sorting numeric literals is now correctly based on value and not plain literal form
- af27103: Added `<resource-value>` component

## 0.2.1

### Patch Changes

- 02c819c: Added `order-dir` and function-based `orderBy` to `<target-node>`

## 0.2.0

### Minor Changes

- db31aa2: Removed `provideFocusNode`, `provideGraph` and `provideEnvironment` mixins. Instead, the respecitve controllers must be used
- db31aa2: Change the `resource-label` `property` property to `predicate`.

## 0.1.0

### Minor Changes

- First release
