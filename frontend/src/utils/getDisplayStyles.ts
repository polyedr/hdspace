import { CssLikeStyles, ScreenDisplay } from '../types';
import assertNever from './asserNever';

function getDisplayStyles(
  activeItemStyles: Pick<
    Required<CssLikeStyles>,
    'display' | 'flex-direction' | 'justify-content' | 'align-items'
  >,
): ScreenDisplay {
  switch (activeItemStyles.display) {
    case 'block':
      return {
        display: activeItemStyles.display,
      };

    case 'inline':
      return {
        display: activeItemStyles.display,
      };

    case 'inline-block':
      return {
        display: activeItemStyles.display,
      };

    case 'flex':
      return {
        display: activeItemStyles.display,
        justifyContent: activeItemStyles['justify-content'],
        alignItems: activeItemStyles['align-items'],
        flexDirection: activeItemStyles['flex-direction'],
      };

    default:
      return assertNever(activeItemStyles.display);
  }
}

export default getDisplayStyles;
