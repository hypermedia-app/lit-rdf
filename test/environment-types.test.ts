import { resolve } from 'node:path'
import { expect, it } from 'vitest'
import * as ts from 'typescript'

const configPath = resolve('tsconfig.json')
const config = ts.readConfigFile(configPath, ts.sys.readFile)
const { options } = ts.parseJsonConfigFileContent(config.config, ts.sys, process.cwd(), { noEmit: true }, configPath)

const imports = `
  import type { ReactiveControllerHost } from 'lit'
  import $rdf from '@zazuko/env/web.js'
  import 'lit-rdf'
  import { Environment } from 'lit-rdf/controllers.js'
  import { configureEnvironment, type MinimumEnvironment } from 'lit-rdf/environment.js'
  import { provideEnvironment } from 'lit-rdf/mixins.js'
  import { LitElement } from 'lit'

  declare const host: ReactiveControllerHost & HTMLElement
  type IsSame<T, U> =
    (<V>() => V extends T ? 1 : 2) extends (<V>() => V extends U ? 1 : 2) ? true : false
  declare function assertType<T extends true>(): void
`

const stockEnvironment = `
  const controller = new Environment(host, env => {
    assertType<IsSame<typeof env, typeof $rdf>>()
  })
  assertType<IsSame<typeof controller.value, typeof $rdf>>()
  controller.value.namespace('https://example.org/')

  const provider = document.createElement('rdf-environment')
  assertType<IsSame<typeof provider.rdf, typeof $rdf>>()
  configureEnvironment($rdf)

  type ExtendedEnvironment = typeof $rdf & { greeting(): string }
  const explicit = new Environment<ExtendedEnvironment>(host)
  assertType<IsSame<typeof explicit.value, ExtendedEnvironment>>()
`

const customEnvironment = `
  declare const appEnv: MinimumEnvironment & { greeting(): string }

  declare module 'lit-rdf/environment.js' {
    interface EnvironmentConfig {
      rdf: typeof appEnv
    }
  }

  configureEnvironment(appEnv)
  assertType<IsSame<Parameters<typeof configureEnvironment>[0], typeof appEnv>>()

  const controller = new Environment(host, env => {
    assertType<IsSame<typeof env, typeof appEnv>>()
  })
  assertType<IsSame<typeof controller.value, typeof appEnv>>()
  controller.value.greeting()

  const provider = document.createElement('rdf-environment')
  assertType<IsSame<typeof provider.rdf, typeof appEnv>>()
  const MixedProvider = provideEnvironment(LitElement)
  assertType<IsSame<InstanceType<typeof MixedProvider>['rdf'], typeof appEnv>>()
`

it.each([
  { name: 'the full stock environment', source: stockEnvironment },
  { name: 'the registered app environment', source: customEnvironment },
])('infers $name from the public entry points', ({ source }) => {
  const file = resolve('test/environment-type-fixture.ts')
  const host = ts.createCompilerHost(options)
  const readFile = host.readFile
  host.readFile = path => path === file ? imports + source : readFile(path)

  const program = ts.createProgram([file], options, host)
  const diagnostics = ts.getPreEmitDiagnostics(program)
  expect(ts.formatDiagnostics(diagnostics, host)).to.equal('')
})
