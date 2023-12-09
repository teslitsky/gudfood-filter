module.exports = {
  root: true,
  env: {
    browser: true,
    jquery: true,
    node: true,
    jest: true,
    webextensions: true,
  },
  plugins: ['security'],
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:security/recommended',
    'prettier',
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  ignorePatterns: ['.eslintrc.js', 'build'],
  rules: {
    'no-console': 0,
  },
};
