module.exports = {
  root: true,
  env: {
    browser: true,
    jquery: true,
    node: true,
    jest: true,
  },
  plugins: ['security'],
  extends: ['airbnb-base', 'plugin:security/recommended', 'prettier'],
};
