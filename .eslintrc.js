module.exports = {
    parser: '@typescript-eslint/parser', // Specifies the ESLint parser
    parserOptions: {
        ecmaVersion: 2020, // Allows modern ECMAScript features
        sourceType: 'module', // Allows the use of imports
    },
    extends: [
        'eslint:recommended',              // Base ESLint recommended rules
        'plugin:@typescript-eslint/recommended', // Recommended rules from the TS plugin
    ],
    rules: {
        // Your custom rules
        // Example: require semicolons
        'semi': ['error', 'always'],
        // Example: require single quotes
        'quotes': ['error', 'single'],
    },
};