---
"lit-rdf": minor
---

Allow custom RDF/JS environments that provide the Clownface, dataset, data model, and namespace builder factories.

This is a breaking type change for consumers that access additional environment members such as `namespace()` through a provider's `rdf` property or the controller's default `.value` type. To access those members through the controller, supply the concrete environment type as its type argument.
