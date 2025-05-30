module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  globals: {
    JsLoadingOverlay: 'readonly',
  },
  plugins: [],
  rules: {

    "no-unused-vars": "off",
    "no-useless-catch": "off",
    "react/prop-types": "off",
    "no-undef": 'off',
    'import/first': 'off',
    'react/no-unescaped-entities': 'off',
    'no-empty': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-curly-newline': 'off',
    'react/jsx-curly-spacing': 'off',
    'react/jsx-equals-spacing': 'off',
    'react/jsx-indent': 'off',
    'react/jsx-indent-props': 'off',
    'react/jsx-max-props-per-line': 'off',
    'react/jsx-tag-spacing': 'off',
    'react/jsx-wrap-multilines': 'off'
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}; 