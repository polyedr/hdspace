import { Framework, FrameworkSelection, FrameworkVersion } from '@Src/types';

export const BOOTSTRAP_VERSIONS: Array<FrameworkVersion> = [
  {
    name: '4.6.0',
    styleSheetsData: [
      {
        key: 'min',
        link:
          'https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css',
        integrity:
          'sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l',
        crossOrigin: 'anonymous',
      },
    ],
    scriptsData: [
      {
        key: 'jquery_min',
        link: 'https://code.jquery.com/jquery-3.5.1.slim.min.js',
        integrity:
          'sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj',
        crossOrigin: 'anonymous',
      },
      {
        key: 'bootstrap_min',
        link:
          'https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/js/bootstrap.bundle.min.js',
        integrity:
          'sha384-Piv4xVNRyMGpqkS2by6br4gNJ7DXjqk09RmUpJ8jgGtD7zP9yug3goQfGII0yAns',
        crossOrigin: 'anonymous',
      },
    ],
  },
];

export const MATERIALIZE_VERSIONS: Array<FrameworkVersion> = [
  {
    name: '1.0.0',
    styleSheetsData: [
      {
        key: 'min',
        link:
          'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css',
      },
    ],
    scriptsData: [
      {
        key: 'min',
        link:
          'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js',
      },
    ],
  },
];

export const NOT_SELECTED_FRAMEWORK: Framework = {
  name: 'not_selected',
  version: null,
};

export const BOOTSTRAP_FRAMEWORK = {
  name: 'bootstrap',
  versions: BOOTSTRAP_VERSIONS,
};

export const MATERIALIZE_FRAMEWORK = {
  name: 'materialize',
  versions: MATERIALIZE_VERSIONS,
};

export const FRAMEWORKS_LIST: FrameworkSelection[] = [
  NOT_SELECTED_FRAMEWORK,
  BOOTSTRAP_FRAMEWORK,
  MATERIALIZE_FRAMEWORK,
];
