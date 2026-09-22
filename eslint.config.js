import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    // shadcn/ui generated components (src/components/ui/**): registry source we
    // don't hand-edit for lint style, so it's re-synced cleanly by `shadcn add`
    // updates. It ships `import * as React from "react"` for broad compatibility
    // (unused under the modern JSX transform) and colocates variant helpers
    // (e.g. buttonVariants) with their component, which trips react-refresh's
    // single-export check. Both are expected here, not bugs.
    files: ['src/components/ui/**/*.{js,jsx}'],
    rules: {
      'no-unused-vars': 'off',
      'react-refresh/only-export-components': 'off',
    },
  },
])
