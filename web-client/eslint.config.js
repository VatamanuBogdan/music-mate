import globals from 'globals';
import eslintPrettierPlugin from 'eslint-plugin-prettier';
import importPlugin from 'eslint-plugin-import';
import eslintReactPlugin from 'eslint-plugin-react';
import eslintReactHooksPlugin from 'eslint-plugin-react-hooks';
import eslintReactRefreshPlugin from 'eslint-plugin-react-refresh';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import typescriptEslintParser from '@typescript-eslint/parser';

export default [{
    files: ['src/**/*.{js,ts,jsx,tsx}'],
    languageOptions: {
        parser: typescriptEslintParser,

        parserOptions: {
            ecmaVersion: 2020,
            sourceType: 'module',
            globals: {
                ...globals.browser,
            },
            ecmaFeatures: {
                jsx: true,
            },
        }
    },
    plugins: {
        'prettier': eslintPrettierPlugin,
        '@typescript-eslint': typescriptEslintPlugin,
        'react': eslintReactPlugin,
        'react-hooks': eslintReactHooksPlugin,
        'react-refresh': eslintReactRefreshPlugin,
        'import': importPlugin
    },
    ignores: [
        '**/node_modules/**', 
        '**/eslint.config.mjs', 
        '**/dist/**', 
        '**/build/**'
    ],
    rules: {
        'prettier/prettier': 'error',

        /* General */
        'no-unused-vars': ['off'],
        'no-plusplus': 'error',
        'no-undef': 'off',
        'no-console': 'warn',
        'eol-last': 'error',
        'prefer-const': 'error',
        'no-var': 'error',
        'no-eval': 'error',
        'no-fallthrough': 'error',
        'grouped-accessor-pairs': ['error', 'getBeforeSet'],
        'eqeqeq': ['error', 'always'],
        'arrow-parens': ['error', 'always'],
        'object-curly-spacing': ['error', 'always'],
        'curly': ['error', 'all'],
        'prefer-template': 'error',
        'no-useless-concat': 'error',

        /* Typescript */
        '@typescript-eslint/no-unused-vars': ['error'],
        '@typescript-eslint/explicit-module-boundary-types': 'error',
        '@typescript-eslint/no-explicit-any': 'error',

        /* React */
        'react/jsx-uses-react': 'error',
        'react/jsx-uses-vars': 'error',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',

        /* Imports */
        'import/no-duplicates': 'error',
        'import/no-unused-modules': 'error',
        'import/no-relative-parent-imports': 'error',
        'import/newline-after-import': 'error',
        'sort-imports': [
            'error',
            {
                'ignoreCase': false,
                'ignoreDeclarationSort': true,
                'ignoreMemberSort': false,
                'memberSyntaxSortOrder': ['none', 'all', 'multiple', 'single']
            }
        ],
        'import/order': [
            'error',
            {
                'groups': [
                    'builtin',
                    'external',
                    'internal',
                    ['parent', 'sibling', 'index']
                ],
                'newlines-between': 'always',
                'alphabetize': { 'order': 'asc', 'caseInsensitive': true }
            }
        ],
    }
}];