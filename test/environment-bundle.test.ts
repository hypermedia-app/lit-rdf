import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import * as ts from 'typescript'
import { expect, it } from 'vitest'

it('does not bundle the stock environment with the configuration entry point', () => {
  const file = resolve('src/environment.ts')
  const source = readFileSync(file, 'utf8')
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ESNext,
    },
  })
  const javascript = ts.createSourceFile(file, outputText, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS)
  const imports = javascript.statements.flatMap((statement) => {
    if (ts.isImportDeclaration(statement) || ts.isExportDeclaration(statement)) {
      return statement.moduleSpecifier && ts.isStringLiteral(statement.moduleSpecifier)
        ? [statement.moduleSpecifier.text]
        : []
    }

    return []
  })

  expect(imports).not.to.include('./default-environment.js')
})
