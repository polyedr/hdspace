import { Entity } from '$domain/core';
import { CssLikeStyles } from '$utils/StyleHelper';
import {
  defaultRootStyles,
  defaultContainerStyles,
  defaultDivBlockStyles,
  defaultImageStyles,
  defaultDropdownStyles,
  defaultDropdownMenuStyles,
  defaultDropdownItemStyles,
  defaultVideoStyles,
  defaultUndefinedStyles,
} from './otherElements/defaultStyles';
import {
  defaultButtonStyles,
  defaultTextinputStyles,
  defaultTextareaStyles,
  defaultCheckboxStyles,
  defaultRadiobuttonStyles,
  defaultLabelStyles,
  defaultSelectStyles,
  defaultSelectMenuStyles,
  defaultSelectItemStyles,
} from './formElements/defaultStyles';
import {
  defaultHyperlinkStyles,
  defaultHeadingStyles,
  defaultParagraphStyles,
  defaultTextBlockStyles,
  defaultListStyles,
  defaultListItemStyles,
} from './typographyElements/defaultStyles';
import {
  defaultMapStyles,
  defaultCalendarStyles,
  defaultClockStyles,
} from './widgetElements/defaultStyles';

export const DEFAULT_ELEMENTS_STYLES: {
  [K in Entity]: { [key: string]: CssLikeStyles };
} = {
  root: defaultRootStyles,
  container: defaultContainerStyles,
  divBlock: defaultDivBlockStyles,
  button: defaultButtonStyles,
  textinput: defaultTextinputStyles,
  textarea: defaultTextareaStyles,
  checkbox: defaultCheckboxStyles,
  radiobutton: defaultRadiobuttonStyles,
  label: defaultLabelStyles,
  hyperlink: defaultHyperlinkStyles,
  heading: defaultHeadingStyles,
  paragraph: defaultParagraphStyles,
  ocrtext: defaultParagraphStyles,
  textBlock: defaultTextBlockStyles,
  list: defaultListStyles,
  listItem: defaultListItemStyles,
  image: defaultImageStyles,
  select: defaultSelectStyles,
  selectMenu: defaultSelectMenuStyles,
  selectItem: defaultSelectItemStyles,
  map: defaultMapStyles,
  calendar: defaultCalendarStyles,
  clock: defaultClockStyles,
  dropdown: defaultDropdownStyles,
  dropdownMenu: defaultDropdownMenuStyles,
  dropdownItem: defaultDropdownItemStyles,
  video: defaultVideoStyles,
  undefined: defaultUndefinedStyles,
};

export const getDefaultStyles = (
  elementType: Entity,
): Required<CssLikeStyles> => {
  return Object.values(
    DEFAULT_ELEMENTS_STYLES[elementType] as {
      [key: string]: Required<CssLikeStyles>;
    },
  ).reduce(
    (acc, styles) => ({ ...acc, ...styles }),
    {} as Required<CssLikeStyles>,
  );
};
