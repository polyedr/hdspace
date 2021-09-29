import { Entity } from '../types/types';
import { DEFAULT_ELEMENTS_STYLES } from '../domain/libraryElements/defaultStyles';

const getDefaultStyles = (elementType: Entity): React.CSSProperties => {
  return Object.values(
    DEFAULT_ELEMENTS_STYLES[elementType] as {
      [key: string]: React.CSSProperties;
    },
  ).reduce((acc, styles) => ({ ...acc, ...styles }), {} as React.CSSProperties);
};

export default getDefaultStyles;
