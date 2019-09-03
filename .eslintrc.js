module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/recommended',
    '@vue/airbnb',
    '@vue/typescript',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'class-methods-use-this': [0],
    'import/no-extraneous-dependencies': [0],
    'no-underscore-dangle': [0],
    'max-len': [0],
    'no-nested-ternary': [0],
    'no-plusplus': [0],
    'import/no-cycle': [0],
    'arrow-parens': ['error', 'as-needed', { requireForBlockBody: true }],
    'vue/max-attributes-per-line': ['error', {
      singleline: 4,
      multiline: {
        max: 1,
        allowFirstLine: false,
      },
    }],
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
};
