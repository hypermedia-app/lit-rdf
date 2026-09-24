# lit-rdf

A collection of lightweight, declarative Web Components for building RDF-driven user interfaces with [Lit](https://lit.dev) and [Clownface](https://zazuko.github.io/clownface/).

Interactive examples, live previews, and API documentation are available in the [Storybook](https://hypermedia-app.github.io/lit-rdf/).

## Installation

```bash
npm install lit-rdf
```

## Available Elements

| Element | Description | Storybook |
| --- | --- | --- |
| [`<rdf-environment>`](src/components/rdf-environment.ts) | Provides an RDF/JS environment in the context for downstream elements. | - |
| [`<data-graph>`](src/components/data-graph.ts) | Consumes an RDF dataset and provides a clownface graph pointer to child components. | - |
| [`<target-node>`](src/components/target-node.ts) | Selects focus nodes from the graph (by type, predicate, or path) with optional sorting. | [Docs](https://hypermedia-app.github.io/lit-rdf/?path=/docs/target-node--docs) ([Source](stories/TargetNode.stories.ts)) |
| [`<focus-node>`](src/components/focus-node.ts) | Sets or provides focus nodes in the context for child elements. | - |
| [`<filter-node>`](src/components/filter-node.ts) | Filters the current focus nodes using clownface filter callbacks. | [Docs](https://hypermedia-app.github.io/lit-rdf/?path=/docs/filter-node--docs) ([Source](stories/FilterNode.stories.ts)) |
| [`<traverse-graph>`](src/components/traverse-graph.ts) | Traverses RDF graph relationships along property paths and renders object nodes. | - |
| [`<resource-label>`](src/components/resource-label.ts) | Renders a human-readable label for the focus node (`rdfs:label`, `schema:name`, etc.). | - |
| [`<resource-link>`](src/components/resource-link.ts) | Renders an anchor (`<a>`) tag linking to a resource URI or property value. | - |
| [`<resource-value>`](src/components/resource-value.ts) | Formats and displays literal or resource values from the focus node. | - |

## Example Usage

Import the elements into your project:

```typescript
import 'lit-rdf'
```

Compose them declaratively in your HTML or Lit templates:

```html
<rdf-environment>
  <data-graph .graph=${graph}>
    <!-- Target person nodes and sort them by name -->
    <target-node target-class="schema:Person" order-by="schema:name">
      <!-- Filter nodes (e.g. by custom condition) -->
      <filter-node .filter=${person => Number(person.out(ns.schema.age).value) >= 18}>
        <article>
          <!-- Display resource label and properties -->
          <h2><resource-label></resource-label></h2>
          <p>Homepage: <resource-link property="schema:url"></resource-link></p>

          <!-- Traverse relations -->
          <h3>Friends:</h3>
          <traverse-graph property-path="schema:knows">
            <p><resource-label></resource-label></p>
          </traverse-graph>
        </article>
      </filter-node>
    </target-node>
  </data-graph>
</rdf-environment>
```

For more detailed guides and interactive demonstrations, visit the [Storybook documentation](https://hypermedia-app.github.io/lit-rdf/).
