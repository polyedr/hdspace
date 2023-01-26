import { UIFrameworkVariables } from '@Src/types';

export type FrameworkVariablesDataSource = Record<string, UIFrameworkVariables>;

export const FRAMEWORK_VARIABLES: FrameworkVariablesDataSource = {
  not_selected: {},
  bootstrap: {
    'bs-primary': { label: 'Primary', value: '#0d6efd' },
    'bs-secondary': { label: 'Secondary', value: '#6c757d' },
    'bs-success': { label: 'Success', value: '#198754' },
    'bs-info': { label: 'Info', value: '#0dcaf0' },
    'bs-warning': { label: 'Warning', value: '#ffc107' },
    'bs-danger': { label: 'Danger', value: '#dc3545' },
    'bs-light': { label: 'Light', value: '#f8f9fa' },
    'bs-dark': { label: 'Dark', value: '#212529' },
    'bs-font-sans-serif': {
      label: 'Font Sans Serif',
      value:
        'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    },
    'bs-font-monospace': {
      label: 'Font Monospace',
      value:
        'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
    'bs-gradient': {
      label: 'Gradient',
      value:
        'linear-gradient(180deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0))',
    },
  },
  material: {
    'mdc-theme-primary': {
      label: 'Primary color',
      value: '#6200ee',
    },
    'mdc-theme-secondary': {
      label: 'Secondary color',
      value: '#018786',
    },
    'mdc-theme-background': {
      label: 'Theme background',
      value: '#fff',
    },
    'mdc-theme-surface': {
      label: 'Surface color',
      value: '#fff',
    },
    'mdc-theme-on-primary': {
      label: 'On-primary color',
      value: '#fff',
    },
    'mdc-theme-on-secondary': {
      label: 'On-secondary color',
      value: '#fff',
    },
    'mdc-theme-on-surface': {
      label: 'On-surface color',
      value: '#000',
    },
    'mdc-theme-primary-bg': {
      label: 'Primary background color',
      value: '#6200ee',
    },
    'mdc-theme-secondary-bg': {
      label: 'Secondary background color',
      value: '#018786',
    },
  },
};
