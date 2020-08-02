import {
  DEFAULT_SIZE,
  DEFAULT_INDENTS,
  DEFAULT_DISPLAY,
  DEFAULT_BORDER,
  DEFAULT_BACKGROUND,
  DEFAULT_BULLETS,
  DEFAULT_TYPOGRAPHY,
} from '$domain/constants/defaultStyles';
import {
  Entity,
  rootStyleControls,
  containerStyleControls,
  divBlockStyleControls,
  buttonStyleControls,
  textinputStyleControls,
  textareaStyleControls,
  checkboxStyleControls,
  radiobuttonStyleControls,
  labelStyleControls,
  hyperlinkStyleControls,
  headingStyleControls,
  paragraphStyleControls,
  textBlockStyleControls,
  listStyleControls,
  listItemStyleControls,
  imageStyleControls,
  selectStyleControls,
  selectMenuStyleControls,
  selectItemStyleControls,
  mapStyleControls,
  calendarStyleControls,
  clockStyleControls,
  dropdownStyleControls,
  dropdownMenuStyleControls,
  dropdownItemStyleControls,
  videoStyleControls,
  undefinedControls,
} from '$domain/core';
import { CssLikeStyles } from '$utils/StyleHelper';

type RootControls = typeof rootStyleControls[number];
type ContainerControls = typeof containerStyleControls[number];
type DivBlockControls = typeof divBlockStyleControls[number];
type ButtonControls = typeof buttonStyleControls[number];
type TextinputControls = typeof textinputStyleControls[number];
type TextareaControls = typeof textareaStyleControls[number];
type CheckboxControls = typeof checkboxStyleControls[number];
type RadiobuttonControls = typeof radiobuttonStyleControls[number];
type LabelControls = typeof labelStyleControls[number];
type HyperlinkControls = typeof hyperlinkStyleControls[number];
type HeadingControls = typeof headingStyleControls[number];
type ParagraphControls = typeof paragraphStyleControls[number];
type TextBlockControls = typeof textBlockStyleControls[number];
type ListControls = typeof listStyleControls[number];
type ListItemControls = typeof listItemStyleControls[number];
type ImageControls = typeof imageStyleControls[number];
type SelectControls = typeof selectStyleControls[number];
type SelectMenuControls = typeof selectMenuStyleControls[number];
type SelectItemControls = typeof selectItemStyleControls[number];
type MapControls = typeof mapStyleControls[number];
type CalendarControls = typeof calendarStyleControls[number];
type ClockControls = typeof clockStyleControls[number];
type DropdownControls = typeof dropdownStyleControls[number];
type DropdownMenuControls = typeof dropdownMenuStyleControls[number];
type DropdownItemControls = typeof dropdownItemStyleControls[number];
type VideoControls = typeof videoStyleControls[number];
type UndefinedControls = typeof undefinedControls[number];

const defaultRootStyles: { [K in RootControls]: CssLikeStyles } & { other?: CssLikeStyles } = {
  background: {
    ...DEFAULT_BACKGROUND,
    'background-color': '#ffffff',
  },
  other: {
    ...DEFAULT_SIZE,
    width: '100%',
    'min-height': '100%',
    'min-width': '100%',
    // Indents need to prevent margin collapsing
    'padding-top': '1px',
    'padding-bottom': '1px',
  },
};

const defaultContainerStyles: { [K in ContainerControls]: CssLikeStyles } & { other?: CssLikeStyles } = {
  indents: {
    ...DEFAULT_INDENTS,
  },
  size: {
    ...DEFAULT_SIZE,
    width: '100%',
  },
  display: {
    ...DEFAULT_DISPLAY,
  },
  typography: {
    ...DEFAULT_TYPOGRAPHY,
  },
  border: {
    ...DEFAULT_BORDER,
  },
  background: {
    ...DEFAULT_BACKGROUND,
  },
};

const defaultDivBlockStyles: { [K in DivBlockControls]: CssLikeStyles } & { other?: CssLikeStyles } = {
  indents: {
    ...DEFAULT_INDENTS,
  },
  size: {
    ...DEFAULT_SIZE,
    width: '100%',
    height: '150px',
  },
  display: {
    ...DEFAULT_DISPLAY,
  },
  typography: {
    ...DEFAULT_TYPOGRAPHY,
  },
  border: {
    ...DEFAULT_BORDER,
  },
  background: {
    ...DEFAULT_BACKGROUND,
  },
};

const defaultButtonStyles: { [K in ButtonControls]: CssLikeStyles } & { other?: CssLikeStyles } = {
  indents: {
    ...DEFAULT_INDENTS,
    'padding-top': '6px',
    'padding-right': '16px',
    'padding-bottom': '6px',
    'padding-left': '16px',
  },
  size: {
    ...DEFAULT_SIZE,
  },
  display: {
    ...DEFAULT_DISPLAY,
    display: 'inline-block',
  },
  typography: {
    ...DEFAULT_TYPOGRAPHY,
    color: '#ffffff',
    'line-height': '1.75',
  },
  border: {
    ...DEFAULT_BORDER,
    'border-color': '#1890ff',
    'border-radius': '4px',
  },
  background: {
    ...DEFAULT_BACKGROUND,
    'background-color': '#1890ff',
  },
};

const defaultTextinputStyles: { [K in TextinputControls]: CssLikeStyles } & { other?: CssLikeStyles } = {
  indents: {
    ...DEFAULT_INDENTS,
    'padding-top': '18.5px',
    'padding-right': '14px',
    'padding-bottom': '18.5px',
    'padding-left': '14px',
  },
  size: {
    ...DEFAULT_SIZE,
  },
  typography: {
    ...DEFAULT_TYPOGRAPHY,
  },
  border: {
    ...DEFAULT_BORDER,
    'border-color': '#d9d9d9',
    'border-width': '1px',
    'border-style': 'solid',
    'border-radius': '4px',
  },
  background: {
    ...DEFAULT_BACKGROUND,
  },
};

const defaultTextareaStyles: { [K in TextareaControls]: CssLikeStyles } & { other?: CssLikeStyles } = {
  indents: {
    ...DEFAULT_INDENTS,
    'padding-top': '18.5px',
    'padding-right': '14px',
    'padding-bottom': '18.5px',
    'padding-left': '14px',
  },
  size: {
    ...DEFAULT_SIZE,
  },
  typography: {
    ...DEFAULT_TYPOGRAPHY,
  },
  border: {
    ...DEFAULT_BORDER,
    'border-color': '#d9d9d9',
    'border-width': '1px',
    'border-style': 'solid',
    'border-radius': '4px',
  },
  background: {
    ...DEFAULT_BACKGROUND,
  },
};

const defaultCheckboxStyles: { [K in CheckboxControls]: CssLikeStyles } & { other?: CssLikeStyles } = {
  indents: {
    ...DEFAULT_INDENTS,
    'padding-top': '0',
    'padding-right': '0',
    'padding-bottom': '0',
    'padding-left': '0',
  },
  size: {
    ...DEFAULT_SIZE,
    width: '24px',
    height: 'auto',
  },
  background: {
    ...DEFAULT_BACKGROUND,
    'background-color': '#1890ff',
  },
};

const defaultRadiobuttonStyles: { [K in RadiobuttonControls]: CssLikeStyles } & { other?: CssLikeStyles } = {
  indents: {
    ...DEFAULT_INDENTS,
    'padding-top': '0',
    'padding-right': '0',
    'padding-bottom': '0',
    'padding-left': '0',
  },
  size: {
    ...DEFAULT_SIZE,
    width: '24px',
    height: 'auto',
  },
  background: {
    ...DEFAULT_BACKGROUND,
    'background-color': '#1890ff',
  },
};

const defaultLabelStyles: { [K in LabelControls]: CssLikeStyles } & { other?: CssLikeStyles } = {
  indents: {
    ...DEFAULT_INDENTS,
    'padding-top': '0',
    'padding-right': '0',
    'padding-bottom': '0',
    'padding-left': '0',
  },
  size: {
    ...DEFAULT_SIZE,
  },
  display: {
    ...DEFAULT_DISPLAY,
    display: 'inline',
  },
  typography: {
    ...DEFAULT_TYPOGRAPHY,
  },
  border: {
    ...DEFAULT_BORDER,
  },
  background: {
    ...DEFAULT_BACKGROUND,
  },
};

const defaultHyperlinkStyles: { [K in HyperlinkControls]: CssLikeStyles } & { other?: CssLikeStyles } = {
  indents: {
    ...DEFAULT_INDENTS,
    'padding-top': '0',
    'padding-right': '0',
    'padding-bottom': '0',
    'padding-left': '0',
  },
  size: {
    ...DEFAULT_SIZE,
  },
  display: {
    ...DEFAULT_DISPLAY,
    display: 'inline',
  },
  typography: {
    ...DEFAULT_TYPOGRAPHY,
    color: '#1890ff',
  },
  border: {
    ...DEFAULT_BORDER,
  },
  background: {
    ...DEFAULT_BACKGROUND,
  },
};

const defaultHeadingStyles: { [K in HeadingControls]: CssLikeStyles } & { other?: CssLikeStyles } = {
  indents: {
    ...DEFAULT_INDENTS,
    'padding-top': '0',
    'padding-right': '0',
    'padding-bottom': '0',
    'padding-left': '0',
  },
  size: {
    ...DEFAULT_SIZE,
  },
  typography: {
    ...DEFAULT_TYPOGRAPHY,
    'font-size': '43px',
    'line-height': '1.167',
  },
  border: {
    ...DEFAULT_BORDER,
  },
  background: {
    ...DEFAULT_BACKGROUND,
  },
};

const defaultParagraphStyles: { [K in ParagraphControls]: CssLikeStyles } & { other?: CssLikeStyles } = {
  indents: {
    ...DEFAULT_INDENTS,
    'padding-top': '0',
    'padding-right': '0',
    'padding-bottom': '0',
    'padding-left': '0',
  },
  size: {
    ...DEFAULT_SIZE,
  },
  typography: {
    ...DEFAULT_TYPOGRAPHY,
  },
  border: {
    ...DEFAULT_BORDER,
  },
  background: {
    ...DEFAULT_BACKGROUND,
  },
};

const defaultTextBlockStyles: { [K in TextBlockControls]: CssLikeStyles } & { other?: CssLikeStyles } = {
  indents: {
    ...DEFAULT_INDENTS,
    'padding-top': '0',
    'padding-right': '0',
    'padding-bottom': '0',
    'padding-left': '0',
  },
  size: {
    ...DEFAULT_SIZE,
  },
  typography: {
    ...DEFAULT_TYPOGRAPHY,
  },
  border: {
    ...DEFAULT_BORDER,
  },
  background: {
    ...DEFAULT_BACKGROUND,
  },
};

const defaultListStyles: { [K in ListControls]: CssLikeStyles } & { other?: CssLikeStyles } = {
  indents: {
    ...DEFAULT_INDENTS,
    'padding-top': '0',
    'padding-right': '0',
    'padding-bottom': '0',
    'padding-left': '40px',
  },
  size: {
    ...DEFAULT_SIZE,
  },
  display: {
    ...DEFAULT_DISPLAY,
  },
  border: {
    ...DEFAULT_BORDER,
  },
  background: {
    ...DEFAULT_BACKGROUND,
  },
  bullets: {
    ...DEFAULT_BULLETS,
  },
};

const defaultListItemStyles: { [K in ListItemControls]: CssLikeStyles } & { other?: CssLikeStyles } = {
  indents: {
    ...DEFAULT_INDENTS,
    'padding-top': '0',
    'padding-right': '0',
    'padding-bottom': '0',
    'padding-left': '0',
  },
  size: {
    ...DEFAULT_SIZE,
  },
  typography: {
    ...DEFAULT_TYPOGRAPHY,
  },
  border: {
    ...DEFAULT_BORDER,
  },
  background: {
    ...DEFAULT_BACKGROUND,
  },
};

const defaultImageStyles: { [K in ImageControls]: CssLikeStyles } & { other?: CssLikeStyles } = {
  indents: {
    ...DEFAULT_INDENTS,
    'padding-top': '0',
    'padding-right': '0',
    'padding-bottom': '0',
    'padding-left': '0',
  },
  size: {
    ...DEFAULT_SIZE,
    width: 'auto',
    height: 'auto',
  },
  border: {
    ...DEFAULT_BORDER,
  },
  background: {
    ...DEFAULT_BACKGROUND,
  },
};

const defaultSelectStyles: { [K in SelectControls]: CssLikeStyles } & { other?: CssLikeStyles } = {
  indents: {
    ...DEFAULT_INDENTS,
    'padding-top': '18.5px',
    'padding-right': '14px',
    'padding-bottom': '18.5px',
    'padding-left': '14px',
  },
  size: {
    ...DEFAULT_SIZE,
  },
  typography: {
    ...DEFAULT_TYPOGRAPHY,
  },
  border: {
    ...DEFAULT_BORDER,
    'border-color': '#d9d9d9',
    'border-width': '1px',
    'border-style': 'solid',
    'border-radius': '4px',
  },
  background: {
    ...DEFAULT_BACKGROUND,
  },
};

const defaultSelectMenuStyles: { [K in SelectMenuControls]: CssLikeStyles } & { other?: CssLikeStyles } = {
  indents: {
    ...DEFAULT_INDENTS,
    'padding-top': '0px',
    'padding-right': '0px',
    'padding-bottom': '0px',
    'padding-left': '0px',
    'margin-top': '0px',
    'margin-right': '0px',
    'margin-bottom': '0px',
    'margin-left': '0px',
  },
  size: {
    ...DEFAULT_SIZE,
  },
  border: {
    ...DEFAULT_BORDER,
    'border-color': '#d9d9d9',
    'border-width': '1px',
    'border-style': 'solid',
    'border-radius': '4px',
  },
  background: {
    ...DEFAULT_BACKGROUND,
    'background-color': '#ffffff',
  },
};

const defaultSelectItemStyles: { [K in SelectItemControls]: CssLikeStyles } & { other?: CssLikeStyles } = {
  indents: {
    ...DEFAULT_INDENTS,
    'padding-top': '6px',
    'padding-right': '16px',
    'padding-bottom': '6px',
    'padding-left': '16px',
  },
  size: {
    ...DEFAULT_SIZE,
  },
  typography: {
    ...DEFAULT_TYPOGRAPHY,
    'line-height': '1.5',
  },
  border: {
    ...DEFAULT_BORDER,
    'border-width': '0px',
  },
  background: {
    ...DEFAULT_BACKGROUND,
    'background-color': '#ffffff',
  },
};

const defaultMapStyles: { [K in MapControls]: CssLikeStyles } & { other?: CssLikeStyles } = {
  indents: {
    ...DEFAULT_INDENTS,
  },
  size: {
    ...DEFAULT_SIZE,
    width: '500px',
    height: '300px',
  },
  typography: {
    ...DEFAULT_TYPOGRAPHY,
  },
  border: {
    ...DEFAULT_BORDER,
  },
  background: {
    ...DEFAULT_BACKGROUND,
  },
};

const defaultCalendarStyles: { [K in CalendarControls]: CssLikeStyles } & { other?: CssLikeStyles } = {
  indents: {
    ...DEFAULT_INDENTS,
  },
  size: {
    ...DEFAULT_SIZE,
  },
  typography: {
    ...DEFAULT_TYPOGRAPHY,
  },
  border: {
    ...DEFAULT_BORDER,
  },
  background: {
    ...DEFAULT_BACKGROUND,
  },
};

const defaultClockStyles: { [K in ClockControls]: CssLikeStyles } & { other?: CssLikeStyles } = {
  indents: {
    ...DEFAULT_INDENTS,
  },
  size: {
    ...DEFAULT_SIZE,
  },
  typography: {
    ...DEFAULT_TYPOGRAPHY,
  },
  border: {
    ...DEFAULT_BORDER,
  },
  background: {
    ...DEFAULT_BACKGROUND,
  },
};

const defaultDropdownStyles: { [K in DropdownControls]: CssLikeStyles } & { other?: CssLikeStyles } = {
  indents: {
    ...DEFAULT_INDENTS,
    'padding-top': '6px',
    'padding-right': '16px',
    'padding-bottom': '6px',
    'padding-left': '16px',
  },
  size: {
    ...DEFAULT_SIZE,
  },
  typography: {
    ...DEFAULT_TYPOGRAPHY,
    color: '#ffffff',
    'line-height': '1.75',
  },
  border: {
    ...DEFAULT_BORDER,
    'border-color': '#1890ff',
    'border-radius': '4px',
  },
  background: {
    ...DEFAULT_BACKGROUND,
    'background-color': '#1890ff',
  },
  other: {
    display: 'inline-block',
  },
};

const defaultDropdownMenuStyles: { [K in DropdownMenuControls]: CssLikeStyles } & { other?: CssLikeStyles } = {
  indents: {
    ...DEFAULT_INDENTS,
    'padding-top': '0px',
    'padding-right': '0px',
    'padding-bottom': '0px',
    'padding-left': '0px',
    'margin-top': '0px',
    'margin-right': '0px',
    'margin-bottom': '0px',
    'margin-left': '0px',
  },
  size: {
    ...DEFAULT_SIZE,
  },
  border: {
    ...DEFAULT_BORDER,
    'border-color': '#d9d9d9',
    'border-width': '1px',
    'border-style': 'solid',
    'border-radius': '4px',
  },
  background: {
    ...DEFAULT_BACKGROUND,
    'background-color': '#ffffff',
  },
};

const defaultDropdownItemStyles: { [K in DropdownItemControls]: CssLikeStyles } & { other?: CssLikeStyles } = {
  indents: {
    ...DEFAULT_INDENTS,
    'padding-top': '6px',
    'padding-right': '16px',
    'padding-bottom': '6px',
    'padding-left': '16px',
  },
  size: {
    ...DEFAULT_SIZE,
  },
  typography: {
    ...DEFAULT_TYPOGRAPHY,
    'line-height': '1.5',
  },
  border: {
    ...DEFAULT_BORDER,
    'border-width': '0px',
  },
  background: {
    ...DEFAULT_BACKGROUND,
    'background-color': '#ffffff',
  },
};

const defaultVideoStyles: { [K in VideoControls]: CssLikeStyles } & { other?: CssLikeStyles } = {
  indents: {
    ...DEFAULT_INDENTS,
    'padding-top': '0',
    'padding-right': '0',
    'padding-bottom': '0',
    'padding-left': '0',
  },
  size: {
    ...DEFAULT_SIZE,
    width: '100%',
    height: 'auto',
  },
  border: {
    ...DEFAULT_BORDER,
  },
};

const defaultUndefinedStyles: { [K in UndefinedControls]: CssLikeStyles } & { other?: CssLikeStyles } = {
  size: {
    ...DEFAULT_SIZE,
    width: '100px',
    height: '100px',
  },
  background: {
    ...DEFAULT_BACKGROUND,
    'background-color': '#fff333',
  },
};

export const DEFAULT_ELEMENTS_STYLES: { [K in Entity]: { [key: string]: CssLikeStyles } } = {
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
  text_block: defaultTextBlockStyles,
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

export const getDefaultStyles = (elementType: Entity): CssLikeStyles => {
  return Object.values(DEFAULT_ELEMENTS_STYLES[elementType]).reduce(
    (acc, styles) => ({ ...acc, ...styles }),
    {}
  );
};
