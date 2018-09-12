const OFF = 0
const WARN = 1
const ERROR = 2

module.exports = {
  extends: 'airbnb',
  parser: 'babel-eslint',
  env: {
    browser: true,
    node: true,
    'jest/globals': true
  },
  plugins: ['jest'],
  rules: {
    'semi': [2, 'never' ],
    'padded-blocks': [OFF],
    'space-before-function-paren': [OFF],
    'comma-dangle': [OFF],
    'no-cond-assign': [OFF],
    'no-plusplus': [OFF, { 'allowForLoopAfterthoughts': true }],
    'no-empty': [OFF, {'allowEmptyCatch': true }],
    'prefer-destructuring': [ERROR, {object: true, array: false}],
    'import/prefer-default-export': [OFF],
    'import/no-extraneous-dependencies': [OFF],
    'react/prop-types': [OFF],
    'react/jsx-filename-extension': [WARN, { extensions: ['.js', '.jsx'] }],
    'react/no-find-dom-node': [OFF]
  }
}
