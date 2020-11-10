import { CssLikeStyles, Entity } from '../types';
import { DEFAULT_ELEMENTS_STYLES } from '../domain/libraryElements/defaultStyles';

const getDefaultStyles = (elementType: Entity): Required<CssLikeStyles> => {
  return Object.values(
    DEFAULT_ELEMENTS_STYLES[elementType] as {
      [key: string]: Required<CssLikeStyles>;
    },
  ).reduce(
    (acc, styles) => ({ ...acc, ...styles }),
    {} as Required<CssLikeStyles>,
  );
};

export default getDefaultStyles;
