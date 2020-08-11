module.exports = {
  env: {
    browser: true,
    es6: true,
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
    'react/jsx-props-no-spreading': 'warn',
    'import/prefer-default-export': 'off',
    'no-nested-ternary': 'warn',
    camelcase: 'warn',
    'jsx-a11y/no-static-element-interactions': 'warn',
    'jsx-a11y/click-events-have-key-events': 'warn',
    'jsx-a11y/mouse-events-have-key-events': 'warn',
    'jsx-a11y/no-noninteractive-tabindex': 'warn',
    'react/jsx-wrap-multilines': 'off',
  },
};
