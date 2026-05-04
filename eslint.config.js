// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import checkFile from 'eslint-plugin-check-file'
import prettier from 'eslint-config-prettier'

export default defineConfig([globalIgnores(['dist']), {
  files: ['**/*.{ts,tsx}'],
  extends: [
    js.configs.recommended,
    tseslint.configs.recommended,
    reactHooks.configs.flat.recommended,
    reactRefresh.configs.vite,
  ],
  languageOptions: {
    globals: globals.browser,
  },
  plugins: {
    'simple-import-sort': simpleImportSort,
    'check-file': checkFile,
  },
  rules: {
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'check-file/filename-naming-convention': [
      'error',
      {
        '**/components/**/*.tsx': 'PASCAL_CASE',
        '**/layouts/**/*.tsx': 'PASCAL_CASE',
        '**/pages/**/*.tsx': 'KEBAB_CASE',
        '**/api/**/*.ts': 'CAMEL_CASE',
      },
      { ignoreMiddleExtensions: true },
    ],
    'check-file/folder-naming-convention': ['error', { 'src/**/': 'KEBAB_CASE' }],
  },
}, prettier, ...storybook.configs["flat/recommended"]])
