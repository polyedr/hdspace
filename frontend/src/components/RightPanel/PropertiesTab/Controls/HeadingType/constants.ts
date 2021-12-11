import { HeadingType } from '../../../../../types';

export const HEADING_TYPE: Array<{ label: string; value: HeadingType }> = [
  {
    label: 'H1',
    value: 'h1',
  },
  {
    label: 'H2',
    value: 'h2',
  },
  {
    label: 'H3',
    value: 'h3',
  },
  {
    label: 'H4',
    value: 'h4',
  },
  {
    label: 'H5',
    value: 'h5',
  },
  {
    label: 'H6',
    value: 'h6',
  },
];

export const HEADING_SETTINGS: Record<HeadingType, { fontSize: string }> = {
  h1: {
    fontSize: '84px',
  },
  h2: {
    fontSize: '52px',
  },
  h3: {
    fontSize: '40px',
  },
  h4: {
    fontSize: '30px',
  },
  h5: {
    fontSize: '21px',
  },
  h6: {
    fontSize: '18px',
  },
};
