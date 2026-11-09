# Collection and application patterns

## Consume a collection, then scope each item

Use [people-demo.ts](../assets/people-demo.ts) for the complete version of this pattern:

```ts
import { html, LitElement } from 'lit'
import { FocusNode } from 'lit-rdf/controllers.js'
import 'lit-rdf'

class ResourceCards extends LitElement {
  private readonly focusController = new FocusNode(this)

  render() {
    const items = this.focusController.array ?? []
    return items.length ? items.map(item => html`
      <focus-node .focusNode=${item}>
        <article>
          <resource-link>
            <resource-label predicate="schema:name"></resource-label>
          </resource-link>
        </article>
      </focus-node>
    `) : html`<p>No matching resources</p>`
  }
}
customElements.define('resource-cards', ResourceCards)
```

Place `<resource-cards>` under a target and optional filter. `FocusNode.pointer` is the entire selection. `FocusNode.array` returns per-node pointers and applies ambient sorting. The controller requests host updates when focus or sorting changes. Handle its initially undefined pointer; context becomes available through element connection.

For a table, put a `focus-node` inside each cell that needs a resource component, or scope custom row components internally. Do not insert a `focus-node` wrapper between native `table`/`tbody`/`tr` elements in parsed HTML: table parsing can relocate invalid children. For keyed collections, use a stable key appropriate to the data and ensure relation displays update when that key retains an existing component.

## Filter and sort

```ts
import type { GraphPointer } from 'clownface'
import rdf from '@zazuko/env/web.js'

const minimumAge = 18
html`
  <target-node target-class="schema:Person"
    order-by="schema:name" order-dir="asc">
    <filter-node .filter=${(person: GraphPointer) => {
      const age = person.out(rdf.ns.foaf.age).value
      return age !== undefined && Number(age) >= minimumAge
    }}>
      <resource-cards></resource-cards>
    </filter-node>
  </target-node>
`
```

The filter is a Clownface callback passed as a property. An omitted callback passes the current selection through. For interactive thresholds, keep the threshold in reactive host state and create a new callback in `render()` so `.filter` changes when the threshold changes. A stable callback closing over mutable state alone does not notify `filter-node` to recompute.

`order-by` converts a predicate IRI to a key extractor. For a custom key use `.orderBy=${(person: GraphPointer) => person.out(rdf.ns.schema.name).value?.toLowerCase()}`. Consumers must use `FocusNode.array` to honor that sort context. Merely wrapping arbitrary slotted markup in `target-node` does not reorder it.

Sorting converts RDF literals to comparable JS values. Use typed numeric/date literals for numeric/date ordering; plain string literals sort as strings. Missing keys sort last in both directions.

## Supply an existing pointer

If the host already has a Clownface pointer, bind it directly with `<focus-node .focusNode=${pointer}>`. Descendant resource elements can consume it without `target-node`. Keep `rdf-environment` and `rdf-dataset` ancestors when other descendants require those contexts. Do not pass a bare IRI or a dataset as `.focusNode`.

## Custom context consumers and providers

Public imports:

```ts
import { Dataset, Environment, FocusNode } from 'lit-rdf/controllers.js'
import { provideEnvironment } from 'lit-rdf/mixins.js'
```

- `new Environment(this)` consumes an ancestor environment; `.value` throws if no provider exists. Access it after connection, rather than assuming availability in the host constructor.
- `new Dataset(this, dataset => { /* update host state */ })` consumes dataset changes and exposes `.value` and a Clownface `.pointer`. Update reactive host state or request an update in the callback if the host renders dataset-derived values.
- `new FocusNode(this)` consumes focus and sorting, exposes `.pointer` and sorted `.array`, and requests updates automatically. `.onChange` can recompute derived state.
- `class Host extends provideEnvironment(LitElement)` supplies an environment after assigning its public `rdf` property. `rdf-environment` already provides the default web environment and is simpler for ordinary templates.

`lit-rdf/context.js` and `lit-rdf/controllers/FocusNode.js` are not exported package paths in this version. Use the public controller barrel rather than inventing context imports for consumers.

## Updates and editing

The library displays RDF data; it does not provide form-to-RDF two-way binding. To implement editing, explicitly add/delete RDF quads in application code and publish a new dataset reference through `rdf-dataset.value` or `rdf-graph.value`. In-place changes to a DatasetCore do not themselves trigger Lit property updates or context delivery. With contributed graphs, update the contribution rather than overwriting the parent's aggregate.

Example after removing a value in application code:

```ts
const next = rdf.dataset([...current])
next.delete(oldQuad)
next.add(replacementQuad)
// Assign next to reactive application state bound as .value=${...}.
```

Keep these current limits in mind for demos involving live data:

- `target-node.setFocusNode()` only publishes selections with at least one term; a transition from matches to no matches can retain the previous focus. Do not promise that switching to an absent class clears the view without checking/fixing this behavior.
- `filter-node` can publish an empty pointer, so it is suitable for demonstrating a working zero-results state.
- For focus-only traversal updates, see the caveat in [binding.md](binding.md). The asset reads ages and friends from each current pointer in the custom renderer instead.

Prefer showing a limitation precisely to adding a broad workaround or silently changing library behavior as part of an example.
