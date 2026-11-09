import { html, LitElement } from 'lit'
import type { GraphPointer } from 'clownface'
import type { NamedNode } from '@rdfjs/types'
import rdf from '@zazuko/env/web.js'
import { FocusNode } from 'lit-rdf/controllers.js'
import 'lit-rdf'

const alice = rdf.namedNode('https://example.org/alice')
const bob = rdf.namedNode('https://example.org/bob')
const carol = rdf.namedNode('https://example.org/carol')
const people: [NamedNode, string, number][] = [
  [alice, 'Alice', 32], [bob, 'Bob', 16], [carol, 'Carol', 24],
]
const graph = rdf.dataset([
  ...people.flatMap(
    ([person, name, age]) => {
      return [
        rdf.quad(person, rdf.ns.rdf.type, rdf.ns.schema.Person),
        rdf.quad(person, rdf.ns.schema.name, rdf.literal(String(name))),
        rdf.quad(person, rdf.ns.foaf.age,
          rdf.literal(String(age), rdf.ns.xsd.integer)),
      ]
    },
  ),
  rdf.quad(alice, rdf.ns.schema.knows, carol),
])

class RdfPeopleCards extends LitElement {
  private readonly focusController = new FocusNode(this)

  render() {
    const people = this.focusController.array ?? []
    if (!people.length) return html`<p>No matching people</p>`

    return people.map(person => html`
      <focus-node .focusNode=${person}>
        <article>
          <h2><resource-label predicate="schema:name"></resource-label></h2>
          <p>Age: ${person.out(rdf.ns.foaf.age).value}</p>
          <resource-link>Resource URI</resource-link>
          <p>Friends: ${person.out(rdf.ns.schema.knows).toArray().map(friend => html`
            <focus-node .focusNode=${friend}>
              <resource-label predicate="schema:name"></resource-label>
            </focus-node>
          `)}</p>
        </article>
      </focus-node>
    `)
  }
}
customElements.define('rdf-people-cards', RdfPeopleCards)

class RdfPeopleDemo extends LitElement {
  static properties = {
    minimumAge: { type: Number },
    direction: { type: String },
  }

  declare minimumAge: number
  declare direction: 'asc' | 'desc'

  constructor() {
    super()
    this.minimumAge = 18
    this.direction = 'asc'
  }

  render() {
    return html`
      <label>Minimum age
        <input type="number" .value=${String(this.minimumAge)}
          @input=${(event: Event) => {
            this.minimumAge = (event.target as HTMLInputElement).valueAsNumber
          }}>
      </label>
      <button @click=${() => {
        this.direction = this.direction === 'asc' ? 'desc' : 'asc'
      }}>Reverse name order</button>
      <rdf-environment>
        <rdf-dataset>
          <rdf-graph .value=${graph}></rdf-graph>
          <target-node target-class="schema:Person"
            order-by="schema:name" order-dir=${this.direction}>
            <filter-node .filter=${(person: GraphPointer) => {
              const age = person.out(rdf.ns.foaf.age).value
              return age !== undefined && Number(age) >= this.minimumAge
            }}>
              <rdf-people-cards></rdf-people-cards>
            </filter-node>
          </target-node>
        </rdf-dataset>
      </rdf-environment>
    `
  }
}
customElements.define('rdf-people-demo', RdfPeopleDemo)

// Initially: Alice (32, friend Carol), then Carol (24).
// Minimum age 0 includes Bob (16); 100 displays “No matching people”.
// Reversing order changes the initial list to Carol, then Alice.
