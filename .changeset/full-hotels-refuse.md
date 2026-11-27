---
"lit-rdf": minor
---

Allow custom RDF/JS environments that provide `clownface`, `dataset`, `fromQuad`, and `ns`.

This is a breaking type change for consumers that access other environment members through a provider's `rdf` property or the controller's default `.value` type. To access additional members through the controller, supply the concrete environment type as its type argument.
