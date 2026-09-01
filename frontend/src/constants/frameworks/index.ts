import {
  FrameworkSelection,
  FrameworkVersion,
  UIFramework,
  NNModelSelection,
} from '@Src/types';

export const BOOTSTRAP_VERSIONS: FrameworkVersion[] = [
  {
    name: '5.0',
    styleSheetsData: [
      {
        key: 'min',
        link: 'https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/css/bootstrap.min.css',
        integrity:
          'sha384-wEmeIV1mKuiNpC+IOBjI7aAzPcEZeedi5yW5f2yOq55WWLwNGmvvx4Um1vskeMj0',
        crossOrigin: 'anonymous',
      },
    ],
    scriptsData: [
      {
        key: 'bootstrap_min',
        link: 'https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js',
        integrity:
          'sha384-p34f1UUtsS3wqzfto5wAAmdvj+osOnFyQFpp4Ua3gs/ZVWx6oOypYoCJhGGScy+8',
        crossOrigin: 'anonymous',
      },
    ],
  },
];

export const MATERIAL_VERSIONS: FrameworkVersion[] = [
  {
    name: '1.0.0',
    styleSheetsData: [
      {
        key: 'min',
        link: 'https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css',
      },
    ],
    scriptsData: [
      {
        key: 'min',
        link: 'https://unpkg.com/material-components-web@latest/dist/material-components-web.min.js',
      },
    ],
  },
];

export const NOT_SELECTED_FRAMEWORK: UIFramework = {
  name: 'not_selected',
  version: null,
  themeVariables: {},
};

export const FRAMEWORKS_LIST: FrameworkSelection[] = [
  {
    name: 'not_selected',
    label: 'Not selected',
    versions: [],
  },
  {
    name: 'bootstrap',
    label: 'Bootstrap',
    versions: BOOTSTRAP_VERSIONS,
  },
  {
    name: 'material',
    label: 'Material',
    versions: MATERIAL_VERSIONS,
  },
];

export const NN_MODEL_LIST: NNModelSelection[] = [
  {
    name: 'fdict',
    label: 'FDict',
  },
  {
    name: 'fordict',
    label: 'ForDict',
  },
  {
    name: 'opencvdict',
    label: 'OpencvDict',
  },
  {
    name: 'cnndict',
    label: 'CnnDict',
  },
];
