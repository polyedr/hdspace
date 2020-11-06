import { CssLikeStyles, Entity } from '../../types';
import {
  buttonStyleControls,
  calendarStyleControls,
  cardsSectionStyleControls,
  checkboxStyleControls,
  clockStyleControls,
  containerStyleControls,
  divBlockStyleControls,
  dropdownItemStyleControls,
  dropdownMenuStyleControls,
  dropdownStyleControls,
  featureSectionStyleControls,
  headingStyleControls,
  hyperlinkStyleControls,
  imageStyleControls,
  labelStyleControls,
  listItemStyleControls,
  listStyleControls,
  mapStyleControls,
  pageTemplateStyleControls,
  paragraphStyleControls,
  radiobuttonStyleControls,
  rootStyleControls,
  selectItemStyleControls,
  selectMenuStyleControls,
  selectStyleControls,
  smartContainerStyleControls,
  subscribeFormStyleControls,
  textareaStyleControls,
  textBlockStyleControls,
  textinputStyleControls,
  undefinedControls,
  videoStyleControls,
} from '../core';

export const DEFAULT_SIZE = {
  width: 'auto',
  height: 'auto',
};

type ScreenIndents = {
  'margin-top'?: string;
  'margin-right'?: string;
  'margin-bottom'?: string;
  'margin-left'?: string;
  'padding-top': string;
  'padding-right': string;
  'padding-bottom': string;
  'padding-left': string;
};

export const DEFAULT_INDENTS: ScreenIndents = {
  'margin-top': '0px',
  'margin-right': '0px',
  'margin-bottom': '0px',
  'margin-left': '0px',
  'padding-top': '0px',
  'padding-right': '0px',
  'padding-bottom': '0px',
  'padding-left': '0px',
};

export const DEFAULT_DISPLAY: CssLikeStyles = {
  display: 'block',
  'flex-direction': 'row',
  'justify-content': 'flex-start',
  'align-items': 'stretch',
};

type ScreenBorders = {
  'border-width': string;
  'border-color': string;
  'border-style': string;
  'border-radius': string;
};

export const DEFAULT_BORDER: ScreenBorders = {
  'border-width': '0px',
  'border-color': '#323232',
  'border-style': 'solid',
  'border-radius': '0px',
};

type ScreenBackground = {
  'background-color': string;
  'background-image': string;
  'background-repeat': string;
  'background-size': string;
};

export const DEFAULT_BACKGROUND: ScreenBackground = {
  'background-color': 'transparent',
  'background-image': 'none',
  'background-repeat': 'no-repeat',
  'background-size': 'cover',
};

export const DEFAULT_BACKGROUND_POSITION: CssLikeStyles = {
  'background-position': '0% 0%',
};

export const DEFAULT_BACKGROUND_SIZE: CssLikeStyles = {
  'background-size': '100% auto',
};

export const DEFAULT_BULLETS: CssLikeStyles = {
  'list-style-type': 'disc',
};

export const DEFAULT_FLEX_GROW: CssLikeStyles = {
  'flex-grow': 0,
};

type ScreenTypography = {
  'font-family': string;
  color: string;
  'font-size': string;
  'line-height': string;
  'font-style': string;
  'font-weight': number;
  'text-align': string;
};

export const DEFAULT_TYPOGRAPHY: ScreenTypography = {
  color: '#323232',
  'font-family': '"Roboto", sans-serif',
  'font-size': '14px',
  'font-style': 'none',
  'font-weight': 400,
  'line-height': '1.5',
  'text-align': 'left',
};

type MapControls = typeof mapStyleControls[number];
type CalendarControls = typeof calendarStyleControls[number];
type ClockControls = typeof clockStyleControls[number];

export const defaultMapStyles: { [K in MapControls]: CssLikeStyles } & {
  other?: CssLikeStyles;
} = {
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

export const defaultCalendarStyles: {
  [K in CalendarControls]: CssLikeStyles;
} & { other?: CssLikeStyles } = {
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

export const defaultClockStyles: { [K in ClockControls]: CssLikeStyles } & {
  other?: CssLikeStyles;
} = {
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

type HyperlinkControls = typeof hyperlinkStyleControls[number];
type HeadingControls = typeof headingStyleControls[number];
type ParagraphControls = typeof paragraphStyleControls[number];
type TextBlockControls = typeof textBlockStyleControls[number];
type ListControls = typeof listStyleControls[number];
type ListItemControls = typeof listItemStyleControls[number];

export const defaultHyperlinkStyles: {
  [K in HyperlinkControls]: CssLikeStyles;
} & { other?: CssLikeStyles } = {
  indents: {
    ...DEFAULT_INDENTS,
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

export const defaultHeadingStyles: { [K in HeadingControls]: CssLikeStyles } & {
  other?: CssLikeStyles;
} = {
  indents: {
    ...DEFAULT_INDENTS,
    'padding-top': '20px',
    'padding-bottom': '10px',
  },
  size: {
    ...DEFAULT_SIZE,
  },
  typography: {
    ...DEFAULT_TYPOGRAPHY,
    'font-size': '40px',
    'line-height': '1.1',
  },
  border: {
    ...DEFAULT_BORDER,
  },
  background: {
    ...DEFAULT_BACKGROUND,
  },
};

export const defaultParagraphStyles: {
  [K in ParagraphControls]: CssLikeStyles;
} & { other?: CssLikeStyles } = {
  indents: {
    ...DEFAULT_INDENTS,
    'padding-top': '6px',
    'padding-left': '3px',
    'padding-bottom': '12px',
    'padding-right': '3px',
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

export const defaultTextBlockStyles: {
  [K in TextBlockControls]: CssLikeStyles;
} & { other?: CssLikeStyles } = {
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

export const defaultListStyles: { [K in ListControls]: CssLikeStyles } & {
  other?: CssLikeStyles;
} = {
  indents: {
    ...DEFAULT_INDENTS,
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

export const defaultListItemStyles: {
  [K in ListItemControls]: CssLikeStyles;
} & { other?: CssLikeStyles } = {
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

type RootControls = typeof rootStyleControls[number];
type ContainerControls = typeof containerStyleControls[number];
type DivBlockControls = typeof divBlockStyleControls[number];
type ImageControls = typeof imageStyleControls[number];
type SmartContainerControls = typeof smartContainerStyleControls[number];
type DropdownControls = typeof dropdownStyleControls[number];
type DropdownMenuControls = typeof dropdownMenuStyleControls[number];
type DropdownItemControls = typeof dropdownItemStyleControls[number];
type VideoControls = typeof videoStyleControls[number];
type UndefinedControls = typeof undefinedControls[number];

export const defaultRootStyles: { [K in RootControls]: CssLikeStyles } & {
  other?: CssLikeStyles;
} = {
  background: {
    ...DEFAULT_BACKGROUND,
    'background-color': '#ffffff',
  },
  other: {
    ...DEFAULT_SIZE,
    width: 'auto',
    height: 'auto',
    'min-height': '100%',
    'min-width': '100%',
    'padding-top': '3px',
    'padding-left': '3px',
    'padding-bottom': '3px',
    'padding-right': '3px',
  },
};

export const defaultContainerStyles: {
  [K in ContainerControls]: CssLikeStyles;
} & { other?: CssLikeStyles } = {
  indents: {
    ...DEFAULT_INDENTS,
    'padding-top': '3px',
    'padding-left': '3px',
    'padding-bottom': '3px',
    'padding-right': '3px',
  },
  size: {
    ...DEFAULT_SIZE,
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
  flexGrow: {
    ...DEFAULT_FLEX_GROW,
  },
};

export const defaultSectionStyles: {
  [K in ContainerControls]: CssLikeStyles;
} & { other?: CssLikeStyles } = {
  indents: {
    ...DEFAULT_INDENTS,
    'padding-top': '3px',
    'padding-left': '3px',
    'padding-bottom': '3px',
    'padding-right': '3px',
  },
  size: {
    ...DEFAULT_SIZE,
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
  flexGrow: {
    ...DEFAULT_FLEX_GROW,
  },
};

export const defaultDivBlockStyles: {
  [K in DivBlockControls]: CssLikeStyles;
} & { other?: CssLikeStyles } = {
  indents: {
    ...DEFAULT_INDENTS,
    'padding-top': '3px',
    'padding-left': '3px',
    'padding-bottom': '3px',
    'padding-right': '3px',
  },
  size: {
    ...DEFAULT_SIZE,
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

export const defaultImageStyles: { [K in ImageControls]: CssLikeStyles } & {
  other?: CssLikeStyles;
} = {
  indents: {
    ...DEFAULT_INDENTS,
  },
  size: {
    ...DEFAULT_SIZE,
  },
  border: {
    ...DEFAULT_BORDER,
  },
  background: {
    ...DEFAULT_BACKGROUND,
  },
};

export const defaultSmartContainerStyles: {
  [K in SmartContainerControls]: CssLikeStyles;
} & { other?: CssLikeStyles } = {
  indents: {
    ...DEFAULT_INDENTS,
  },
  size: {
    ...DEFAULT_SIZE,
    'min-height': '48px',
  },
  display: {
    ...DEFAULT_DISPLAY,
  },
  typography: {
    ...DEFAULT_TYPOGRAPHY,
  },
  border: {
    ...DEFAULT_BORDER,
    'border-color': '#e7eaec',
  },
  background: {
    ...DEFAULT_BACKGROUND,
    'background-color': '#e0e0e0',
  },
};

export const defaultDropdownStyles: {
  [K in DropdownControls]: CssLikeStyles;
} & { other?: CssLikeStyles } = {
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

export const defaultDropdownMenuStyles: {
  [K in DropdownMenuControls]: CssLikeStyles;
} & { other?: CssLikeStyles } = {
  indents: {
    ...DEFAULT_INDENTS,
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

export const defaultDropdownItemStyles: {
  [K in DropdownItemControls]: CssLikeStyles;
} & { other?: CssLikeStyles } = {
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

export const defaultVideoStyles: { [K in VideoControls]: CssLikeStyles } & {
  other?: CssLikeStyles;
} = {
  indents: {
    ...DEFAULT_INDENTS,
  },
  size: {
    ...DEFAULT_SIZE,
    height: 'auto',
  },
  border: {
    ...DEFAULT_BORDER,
  },
};

export const defaultUndefinedStyles: {
  [K in UndefinedControls]: CssLikeStyles;
} & { other?: CssLikeStyles } = {
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

type ButtonControls = typeof buttonStyleControls[number];
type TextinputControls = typeof textinputStyleControls[number];
type TextareaControls = typeof textareaStyleControls[number];
type CheckboxControls = typeof checkboxStyleControls[number];
type RadiobuttonControls = typeof radiobuttonStyleControls[number];
type LabelControls = typeof labelStyleControls[number];
type SelectControls = typeof selectStyleControls[number];
type SelectMenuControls = typeof selectMenuStyleControls[number];
type SelectItemControls = typeof selectItemStyleControls[number];

export const defaultButtonStyles: { [K in ButtonControls]: CssLikeStyles } & {
  other?: CssLikeStyles;
} = {
  indents: {
    ...DEFAULT_INDENTS,
    'padding-top': '6px',
    'padding-right': '17px',
    'padding-bottom': '6px',
    'padding-left': '17px',
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

export const defaultTextinputStyles: {
  [K in TextinputControls]: CssLikeStyles;
} & { other?: CssLikeStyles } = {
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

export const defaultTextareaStyles: {
  [K in TextareaControls]: CssLikeStyles;
} & { other?: CssLikeStyles } = {
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

export const defaultCheckboxStyles: {
  [K in CheckboxControls]: CssLikeStyles;
} & { other?: CssLikeStyles } = {
  indents: {
    ...DEFAULT_INDENTS,
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

export const defaultRadiobuttonStyles: {
  [K in RadiobuttonControls]: CssLikeStyles;
} & { other?: CssLikeStyles } = {
  indents: {
    ...DEFAULT_INDENTS,
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

export const defaultLabelStyles: { [K in LabelControls]: CssLikeStyles } & {
  other?: CssLikeStyles;
} = {
  indents: {
    ...DEFAULT_INDENTS,
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

export const defaultSelectStyles: { [K in SelectControls]: CssLikeStyles } & {
  other?: CssLikeStyles;
} = {
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

export const defaultSelectMenuStyles: {
  [K in SelectMenuControls]: CssLikeStyles;
} & { other?: CssLikeStyles } = {
  indents: {
    ...DEFAULT_INDENTS,
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

export const defaultSelectItemStyles: {
  [K in SelectItemControls]: CssLikeStyles;
} & { other?: CssLikeStyles } = {
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

type pageTemplateControls = typeof pageTemplateStyleControls[number];
type subscribeFormControls = typeof subscribeFormStyleControls[number];
type cardsSectionControls = typeof cardsSectionStyleControls[number];
type featureSectionControls = typeof featureSectionStyleControls[number];

export const defaultPageTemplateStyles: {
  [K in pageTemplateControls]: CssLikeStyles;
} = {
  indents: {
    ...DEFAULT_INDENTS,
  },
  size: {
    ...DEFAULT_SIZE,
    width: '100%',
    height: '100%',
  },
  display: {
    ...DEFAULT_DISPLAY,
    display: 'flex',
    'flex-direction': 'column',
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

export const defaultGridStyles: {
  [K in pageTemplateControls]: CssLikeStyles;
} = {
  indents: {
    ...DEFAULT_INDENTS,
    'padding-top': '3px',
    'padding-left': '3px',
    'padding-bottom': '3px',
    'padding-right': '3px',
  },
  size: {
    ...DEFAULT_SIZE,
    width: '100%',
    height: '100%',
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

export const defaultColumnStyles: {
  [K in pageTemplateControls]: CssLikeStyles;
} = {
  indents: {
    ...DEFAULT_INDENTS,
    'padding-top': '3px',
    'padding-left': '3px',
    'padding-bottom': '3px',
    'padding-right': '3px',
  },
  size: {
    ...DEFAULT_SIZE,
    width: '100%',
    height: '100%',
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

export const defaultEmptyPageTemplateStyles: {
  [K in pageTemplateControls]: CssLikeStyles;
} = {
  indents: {
    ...DEFAULT_INDENTS,
  },
  size: {
    ...DEFAULT_SIZE,
    width: '100%',
    height: '100%',
  },
  display: {
    ...DEFAULT_DISPLAY,
    display: 'flex',
    'flex-direction': 'column',
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

export const defaultSubscribeFormStyles: {
  [K in subscribeFormControls]: CssLikeStyles;
} = {
  indents: {
    ...DEFAULT_INDENTS,
    'padding-top': '100px',
    'padding-bottom': '100px',
  },
  size: {
    ...DEFAULT_SIZE,
    width: '100%',
  },
  display: {
    ...DEFAULT_DISPLAY,
    display: 'flex',
    'flex-direction': 'column',
    'align-items': 'center',
    'justify-content': 'center',
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

export const defaultCardsSectionStyles: {
  [K in cardsSectionControls]: CssLikeStyles;
} = {
  indents: {
    ...DEFAULT_INDENTS,
    'padding-top': '100px',
    'padding-bottom': '100px',
  },
  size: {
    ...DEFAULT_SIZE,
    width: '100%',
  },
  display: {
    ...DEFAULT_DISPLAY,
    display: 'flex',
    'flex-direction': 'column',
    'align-items': 'center',
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

export const defaultFeatureSectionStyles: {
  [K in featureSectionControls]: CssLikeStyles;
} = {
  indents: {
    ...DEFAULT_INDENTS,
    'padding-top': '100px',
    'padding-bottom': '100px',
  },
  size: {
    ...DEFAULT_SIZE,
    width: '100%',
  },
  display: {
    ...DEFAULT_DISPLAY,
    display: 'flex',
    'justify-content': 'center',
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

export const DEFAULT_ELEMENTS_STYLES: {
  [K in Entity]: { [key: string]: CssLikeStyles | undefined };
} = {
  root: defaultRootStyles,
  container: defaultContainerStyles,
  divBlock: defaultDivBlockStyles,
  pageTemplate: defaultPageTemplateStyles,
  emptyPageTemplate: defaultEmptyPageTemplateStyles,
  grid: defaultGridStyles,
  columns: defaultColumnStyles,
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
  smartHeader: defaultSmartContainerStyles,
  smartFooter: defaultSmartContainerStyles,
  smartForm: defaultSmartContainerStyles,
  smartWebpage: defaultSmartContainerStyles,
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
  subscribeForm: defaultSubscribeFormStyles,
  cardsSection: defaultCardsSectionStyles,
  featureSection: defaultFeatureSectionStyles,
  section: defaultSectionStyles,
};
