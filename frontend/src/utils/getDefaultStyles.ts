import { CSSProperties } from 'react';
import { Entity } from '@Src/types';
import { DEFAULT_ELEMENTS_STYLES } from '@Domain/libraryElements/defaultStyles';

const getDefaultStyles = (elementType: Entity): CSSProperties =>
  Object.values(DEFAULT_ELEMENTS_STYLES[elementType]).reduce<CSSProperties>(
    (acc, styles) => ({ ...acc, ...styles }),
    {},
  );

export default getDefaultStyles;
