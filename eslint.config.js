import config from '@tpluscode/eslint-config'
import { globalIgnores } from 'eslint/config'
import storybook from 'eslint-plugin-storybook'
import { includeIgnoreFile } from "@eslint/config-helpers";
import { fileURLToPath } from 'node:url'

export default [
  ...config,
  ...storybook.configs['flat/recommended'],
  includeIgnoreFile(fileURLToPath(new URL(".gitignore", import.meta.url)), { gitignoreResolution: true }),
  {
    ignores: [
      "vite.config.ts",
      "vitest.config.ts",
      "global.d.ts",
      "storybook-static/*",
      "coverage/*"
    ],
  },
  globalIgnores(['!.storybook'], 'Include Storybook Directory'),
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.lint.json',
      },
    },
  },
]
