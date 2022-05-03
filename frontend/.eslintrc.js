const shouldBeImportedFromMaterialStyles = [
  'lighten',
  'darken',
  'useTheme',
  'makeStyles',
  'createStyles',
  'MuiThemeProvider',
  'ColorFormat',
  'ColorObject',
  'ComponentCreator',
  'ComponentsPropsList',
  'Direction',
  'Duration',
  'Easing',
  'PaletteColorOptions',
  'ServerStyleSheets',
  'SimplePaletteColorOptions',
  'StyleRules',
  'StyleRulesCallback',
  'StyledComponentProps',
  'StyledProps',
  'StylesProvider',
  'Theme',
  'ThemeOptions',
  'ThemeProvider',
  'ThemeProviderProps',
  'Transitions',
  'TransitionsOptions',
  'TypographyStyle',
  'TypographyVariant',
  'WithStyles',
  'WithTheme',
  'createGenerateClassName',
  'createMuiTheme',
  'decomposeColor',
  'duration',
  'easing',
  'emphasize',
  'fade',
  'formatMs',
  'getContrastRatio',
  'withTheme',
  'withStyles',
  'styled',
  'rgbToHex',
  'responsiveFontSizes',
  'recomposeColor',
  'jssPreset',
  'hexToRgb',
  'hslToRgb',
  'getLuminance',
];

module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  extends: ['airbnb', 'prettier', 'plugin:react-hooks/recommended'],
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
  plugins: ['react', '@typescript-eslint', 'prettier', 'import', 'react-hooks'],
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
    'react/require-default-props': 'off', // should be disabled with typescript
    'react/no-danger': 'off',
    radix: [2, 'as-needed'], // allow to omit second parameter when possible
    'react/jsx-wrap-multilines': 'off', // to avoid conflicts with prettier
    'react/jsx-props-no-spreading': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    'no-nested-ternary': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/mouse-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'no-shadow': 'off',
    'no-plusplus': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'no-underscore-dangle': ['error', { allowAfterThis: true }],
    'no-param-reassign': [
      'error',
      { ignorePropertyModificationsFor: ['draft'] },
    ],
    'react/jsx-indent': 'off',
    'lines-between-class-members': 'off',
    'func-names': ['error', 'as-needed', { generators: 'never' }],
    camelcase: 'off',
    'no-console': 'error',
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'no-restricted-imports': [
      'error',
      {
        patterns: ['@mui/*/*/*', '!@mui/material/test-utils/*'],
        paths: [
          {
            name: '@material-ui/core',
            importNames: shouldBeImportedFromMaterialStyles,
            message:
              "Please use named import from '@material-ui/core/styles' instead.",
          },
          {
            name: 'ramda',
            importNames: ['*'],
            message: "Please use named import from 'ramda' instead.",
          },
        ],
      },
    ],
  },
};
