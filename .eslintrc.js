const path = require('path');

module.exports = {
  extends: 'vinta/recommended',
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    'jest/prefer-inline-snapshots': ['off'],
    'import/no-extraneous-dependencies': ['error', {'devDependencies': true}],
  },
  env: {
    es6: true,
    browser: true,
    jest: true
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: path.join(__dirname, '/webpack.local.config.js'),
        'config-index': 1
      }
    }
  }
}
