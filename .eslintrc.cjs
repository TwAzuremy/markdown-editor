module.exports = {
    root: true,
    env: {browser: true, es2020: true},
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
    ],
    ignorePatterns: ['dist', '.eslintrc.cjs', 'dist-electron'],
    parser: '@typescript-eslint/parser',
    plugins: ['react-refresh'],
    rules: {
        'react-refresh/only-export-components': [
            'warn',
            {allowConstantExport: true},
        ],
        // Disable warnings for unused variables
        '@typescript-eslint/no-unused-vars': 'off',
        'no-unused-vars': 'off',
        // Disable warnings for unused functions
        '@typescript-eslint/no-unused-expressions': 'off',
        // Requires ending with a semicolon
        'semi': ['error', 'always'],
        '@typescript-eslint/indent': 'off'
    },
}
