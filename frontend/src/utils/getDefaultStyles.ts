import { Entity } from '@Src/types';
import { DEFAULT_ELEMENTS_STYLES } from '@Domain/libraryElements/defaultStyles';
import { CSSProperties } from 'react';

const getDefaultStyles = (elementType: Entity): CSSProperties => {
  return Object.values(
    DEFAULT_ELEMENTS_STYLES[elementType] as {
      [key: string]: CSSProperties;
    },
  ).reduce((acc, styles) => ({ ...acc, ...styles }), {} as CSSProperties);
};

export default getDefaultStyles;
