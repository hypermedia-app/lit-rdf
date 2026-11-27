import { expect, fixture, html } from '@open-wc/testing'
import $rdf from '@zazuko/env/web.js'
import { LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'
import { Environment } from '../../src/controllers/Environment.js'
import { configureEnvironment } from '../../src/environment.js'
import type { Environment as RdfEnvironment } from '../../src/environment.js'
import { provideEnvironment } from '../../src/mixins/environment.js'
import '../../src/components/rdf-environment.js'

@customElement('test-environment-consumer')
class TestEnvironmentConsumer extends LitElement {
  received?: RdfEnvironment

  readonly environment = new Environment(this, (value) => {
    this.received = value
  })

  connectionError?: Error

  override connectedCallback() {
    try {
      super.connectedCallback()
    }
    catch (error) {
      this.connectionError = error as Error
    }
  }
}

@customElement('test-empty-environment-provider')
class TestEmptyEnvironmentProvider extends provideEnvironment(LitElement) {
  constructor() {
    super()
    this.rdf = undefined as unknown as RdfEnvironment
  }

  render() {
    return html`<slot></slot>`
  }
}

describe('rdf-environment', function () {
  it('provides the stock environment without startup configuration', async function () {
    const provider = await fixture(html`
      <rdf-environment>
        <test-environment-consumer></test-environment-consumer>
      </rdf-environment>
    `)

    const consumer = provider.querySelector<TestEnvironmentConsumer>('test-environment-consumer')!
    expect(consumer.environment.value).to.equal($rdf)
  })

  it('provides the configured environment to descendants of new providers', async function () {
    const configured = new Proxy($rdf, {})
    configureEnvironment(configured)

    try {
      const root = await fixture(html`
        <div>
          <rdf-environment>
            <test-environment-consumer></test-environment-consumer>
          </rdf-environment>
          <rdf-environment>
            <test-environment-consumer></test-environment-consumer>
          </rdf-environment>
        </div>
      `)

      const consumers = root.querySelectorAll<TestEnvironmentConsumer>('test-environment-consumer')
      expect(consumers).to.have.length(2)
      for (const consumer of consumers) {
        expect(consumer.environment.value).to.equal(configured)
        expect(consumer.received).to.equal(configured)
      }
    }
    finally {
      configureEnvironment($rdf)
    }
  })

  it('explains how to provide an environment when connected without one', async function () {
    const consumer = await fixture<TestEnvironmentConsumer>(html`<test-environment-consumer></test-environment-consumer>`)

    expect(consumer.connectionError).to.be.instanceOf(Error)
    expect(consumer.connectionError?.message).to.match(/<rdf-environment>|provideEnvironment/)
    expect(() => consumer.environment.value).to.throw(/<rdf-environment>|provideEnvironment/)
  })

  it('rejects a provider with an undefined environment before invoking callbacks', async function () {
    const provider = await fixture(html`
      <test-empty-environment-provider>
        <test-environment-consumer></test-environment-consumer>
      </test-empty-environment-provider>
    `)

    expect(provider).to.be.instanceOf(TestEmptyEnvironmentProvider)
    const consumer = provider.querySelector<TestEnvironmentConsumer>('test-environment-consumer')!
    expect(consumer.connectionError).to.be.instanceOf(Error)
    expect(consumer.received).to.be.undefined
  })

  it('does not reuse the previous environment after reconnecting without a provider', async function () {
    const provider = await fixture(html`
      <rdf-environment>
        <test-environment-consumer></test-environment-consumer>
      </rdf-environment>
    `)
    const consumer = provider.querySelector<TestEnvironmentConsumer>('test-environment-consumer')!
    const destination = await fixture(html`<div></div>`)

    expect(consumer.environment.value).to.equal($rdf)
    consumer.remove()
    destination.append(consumer)

    expect(consumer.connectionError).to.be.instanceOf(Error)
    expect(() => consumer.environment.value).to.throw(/<rdf-environment>|provideEnvironment/)
  })
})
