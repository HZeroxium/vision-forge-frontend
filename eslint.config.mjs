// eslint.config.mjs
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  {
    // ✅ Explicitly define Next.js plugin
    plugins: {
      next: require('eslint-plugin-next'),
    },
  },
  ...compat.extends(
    'next/core-web-vitals', // Check web performance
    'next/typescript', // Better TypeScript support
    'prettier' // Ensure code format is correct,
  ),
  {
    rules: {
      // 🔥 Detect missing "use client";
      'next/no-async-client-component': 'error',

      // 🔥 Detect usage of `useEffect`, `useState`, `window`, ... in Server Component
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // 🔥 Disallow importing libraries that only run on the browser in Server Component
      'import/no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'react-quill',
              message:
                "⚠️ Do not use react-quill in Server Component. Please add 'use client'; at the beginning of the file.",
            },
            {
              name: 'chart.js',
              message:
                "⚠️ Do not use chart.js in Server Component. Please add 'use client';.",
            },
          ],
          patterns: [
            {
              group: ['fs', 'path', 'child_process'],
              message: '⚠️ Do not use Node.js API in Client Component.',
            },
          ],
        },
      ],

      // 🔥 Warn if using `window`, `document`, `localStorage` in Server Component
      'no-restricted-globals': [
        'error',
        {
          name: 'window',
          message:
            "⚠️ Do not use window in Server Component. Please add 'use client'; at the beginning of the file.",
        },
        {
          name: 'document',
          message:
            "⚠️ Do not use document in Server Component. Please add 'use client';.",
        },
        {
          name: 'localStorage',
          message: '⚠️ Do not use localStorage in Server Component.',
        },
      ],

      // 🔥 Prevent importing SVG images as modules (only Next.js Image is allowed)
      'import/no-unresolved': [
        'error',
        {
          ignore: ['\\.svg$'],
        },
      ],

      // 🔥 Check for Next.js Server Components errors
      'next/no-server-import-in-page': 'error',
    },
  },
]

export default eslintConfig
