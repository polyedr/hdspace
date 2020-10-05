module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  extends: ['airbnb', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
    typescript: {
      project: '.',
    },
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-unused-vars': [2, { args: 'none' }], // to admit types as used vars
      },
    },
  ],
  plugins: ['react', '@typescript-eslint', 'prettier', 'import'],
  rules: {
    'prettier/prettier': 'error', // use prettier to enforce code style
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ], // suppress "missing file extension" for ts files
    'react/jsx-filename-extension': [
      2,
      { extensions: ['.js', '.jsx', '.tsx'] },
    ], // allow use jsx in ts files
    'react/jsx-curly-newline': 'off', // should be disabled with prettier
    'react/prop-types': 'off', // should be disabled with typescript
    radix: [2, 'as-needed'], // allow to omit second parameter when possible
    'react/jsx-wrap-multilines': 'off', // to avoid conflicts with prettier
    'import/no-cycle': 'off', // TODO: get rid of cyclic dependencies
    'react/jsx-props-no-spreading': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    'no-nested-ternary': 'warn',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/mouse-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'no-shadow': 'off',
    'no-param-reassign': [
      'error',
      { ignorePropertyModificationsFor: ['draft'] },
    ],
  },
};
