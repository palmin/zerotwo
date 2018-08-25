module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 8,
  },
  env: {
    browser: true,
    node: true,
    jquery: true,
  },
  extends: 'airbnb-base',
  globals: {
    __static: true,
  },
  plugins: ['html'],
  rules: {
    'global-require': 0,
    'import/no-unresolved': 0,
    'no-param-reassign': 0,
    'no-shadow': 0,
    'import/extensions': 0,
    'import/newline-after-import': 0,
    'no-multi-assign': 0,
    'object-curly-newline': ['error', {
      'ObjectExpression': { 'multiline': true },
      'ObjectPattern': { 'multiline': true },
      'ImportDeclaration': 'never',
      'ExportDeclaration': { 'multiline': true, 'minProperties': 3 }
    }],
    // allow debugger during development
    'no-unused-vars': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
  },
}
