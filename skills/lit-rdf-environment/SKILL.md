---
name: lit-rdf-environment
description: Use when configuring a custom RDF/JS environment in a lit-rdf app and inferring its type in descendant Lit controllers through TypeScript module augmentation.
---

# Configure a lit-rdf environment

Use this workflow with versions of `lit-rdf` that export `lit-rdf/environment.js`. Apps that use the stock environment can render `<rdf-environment>` directly and get the full `@zazuko/env/web.js` type in `new Environment(this)`.

For an app with one shared environment, augment `EnvironmentConfig` with an `rdf` property typed as the app's environment. Call `configureEnvironment(appEnv)` before creating any `<rdf-environment>` elements. If the tag is already in the DOM, configure before importing the module that registers it, since registration upgrades existing elements.

The registered environment must satisfy `MinimumEnvironment` from `lit-rdf/environment.js`. It combines the Clownface, dataset, RDF/JS data model, and namespace builder factories with the RDF/JS environment's `clone()` method. To keep all the stock capabilities and add a factory, create an environment with the stock web environment as its parent.

```ts
import $rdf from '@zazuko/env/web.js'
import RdfEnvironment from '@zazuko/env/Environment.js'
import { LitElement, html } from 'lit'
import { Environment } from 'lit-rdf/controllers.js'
import { configureEnvironment } from 'lit-rdf/environment.js'

class CatalogFactory {
  static exports = ['catalogName']

  catalogName() {
    return 'RDF catalog'
  }
}

const appEnv: typeof $rdf & CatalogFactory = new RdfEnvironment([CatalogFactory], { parent: $rdf })

declare module 'lit-rdf/environment.js' {
  interface EnvironmentConfig {
    rdf: typeof appEnv
  }
}

configureEnvironment(appEnv)
await import('lit-rdf')

class CatalogTitle extends LitElement {
  private readonly environment = new Environment(this)

  render() {
    return html`<h1>${this.environment.value.catalogName()}</h1>`
  }
}

customElements.define('catalog-title', CatalogTitle)
```

```html
<rdf-environment>
  <catalog-title></catalog-title>
</rdf-environment>
```

The provider passes the configured instance through context. The descendant reads it during rendering and displays **RDF catalog**. The controller's `.value` and callback parameter both use the registered app type.

Module augmentation applies throughout the TypeScript project. Keep the augmentation and runtime configuration in the startup module so the types and provided value agree. If a subtree provides its own `rdf` value, that value must satisfy the registered type too. Read the controller value after the host connects to a provider.
