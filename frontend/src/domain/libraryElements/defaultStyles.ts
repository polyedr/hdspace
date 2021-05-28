import { Alignments, Entity } from '@Src/types';
import {
  buttonStyleControls,
  calendarStyleControls,
  cardsSectionStyleControls,
  checkboxStyleControls,
  clockStyleControls,
  nativeColumnsStyleControls,
  columnStyleControls,
  containerStyleControls,
  divBlockStyleControls,
  dropdownItemStyleControls,
  dropdownMenuStyleControls,
  dropdownStyleControls,
  featureSectionStyleControls,
  gridItemStyleControls,
  gridStyleControls,
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
  optionStyleControls,
  selectMenuStyleControls,
  selectStyleControls,
  smartContainerStyleControls,
  subscribeFormStyleControls,
  textareaStyleControls,
  textBlockStyleControls,
  textinputStyleControls,
  undefinedControls,
  videoStyleControls,
  columnsStyleControls,
  elementsGroupStyleControls,
  htmlElementControls,
  radiobuttonGroupStyleControls,
} from '../core';

const columnsMinHeight = '100px';

export const DEFAULT_SIZE = {
  width: 'auto',
  height: 'auto',
};

export const DEFAULT_INDENTS: React.CSSProperties = {
  margin: '0px',
  padding: '0px',
};

export const DEFAULT_DISPLAY: React.CSSProperties = {
  display: 'block',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
};

export const DEFAULT_BORDER: React.CSSProperties = {
  border: '0px solid #323232',
  borderRadius: '0px',
  borderColor: '#323232',
  borderWidth: '0px',
  borderStyle: 'solid',
};

export const DEFAULT_BACKGROUND: React.CSSProperties = {
  backgroundColor: 'transparent',
  backgroundImage: 'none',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
};

export const DEFAULT_BACKGROUND_POSITION: React.CSSProperties = {
  backgroundPosition: '0% 0%',
};

export const DEFAULT_BACKGROUND_SIZE: React.CSSProperties = {
  backgroundSize: '100% auto',
};

export const DEFAULT_BULLETS: React.CSSProperties = {
  listStyleType: 'disc',
};

export const DEFAULT_FLEX_GROW: React.CSSProperties = {
  flexGrow: 0,
};

export const DEFAULT_TYPOGRAPHY: React.CSSProperties = {
  color: '#323232',
  fontFamily: '"Roboto", sans-serif',
  fontSize: '14px',
  fontStyle: 'none',
  fontWeight: 400,
  lineHeight: '1.5',
  textAlign: 'left',
};

type MapControls = typeof mapStyleControls[number];
type CalendarControls = typeof calendarStyleControls[number];
type ClockControls = typeof clockStyleControls[number];

export const defaultMapStyles: { [K in MapControls]: React.CSSProperties } & {
  other?: React.CSSProperties;
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
  [K in CalendarControls]: React.CSSProperties;
} & { other?: React.CSSProperties } = {
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

export const defaultClockStyles: {
  [K in ClockControls]: React.CSSProperties;
} & {
  other?: React.CSSProperties;
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
  [K in HyperlinkControls]: React.CSSProperties;
} & { other?: React.CSSProperties } = {
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

export const defaultHeadingStyles: {
  [K in HeadingControls]: React.CSSProperties;
} & {
  other?: React.CSSProperties;
} = {
  indents: {
    ...DEFAULT_INDENTS,
    paddingTop: '20px',
    paddingBottom: '10px',
  },
  size: {
    ...DEFAULT_SIZE,
  },
  typography: {
    ...DEFAULT_TYPOGRAPHY,
    fontSize: '40px',
    lineHeight: '1.1',
    fontWeight: 400,
  },
  border: {
    ...DEFAULT_BORDER,
  },
  background: {
    ...DEFAULT_BACKGROUND,
  },
  other: {
    wordBreak: 'break-word',
    outline: 0,
  },
};

export const defaultParagraphStyles: {
  [K in ParagraphControls]: React.CSSProperties;
} & { other?: React.CSSProperties } = {
  indents: {
    ...DEFAULT_INDENTS,
    paddingTop: '6px',
    paddingLeft: '3px',
    paddingBottom: '12px',
    paddingRight: '3px',
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
  other: {
    outline: 0,
    wordBreak: 'break-word',
  },
};

export const defaultTextBlockStyles: {
  [K in TextBlockControls]: React.CSSProperties;
} & { other?: React.CSSProperties } = {
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
  other: {
    outline: 0,
  },
};

export const defaultListStyles: { [K in ListControls]: React.CSSProperties } & {
  other?: React.CSSProperties;
} = {
  indents: {
    ...DEFAULT_INDENTS,
    paddingLeft: '40px',
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
  [K in ListItemControls]: React.CSSProperties;
} & { other?: React.CSSProperties } = {
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
  other: {
    outline: 0,
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
type HTMLElementControls = typeof htmlElementControls[number];
type NativeColumnsControls = typeof nativeColumnsStyleControls[number];
type ColumnsControls = typeof columnsStyleControls[number];
type ColumnControls = typeof columnStyleControls[number];
type GridItemControls = typeof gridItemStyleControls[number];
type GridControls = typeof gridStyleControls[number];
type ElementsGroupControls = typeof elementsGroupStyleControls[number];

export const defaultRootStyles: { [K in RootControls]: React.CSSProperties } & {
  other?: React.CSSProperties;
} = {
  background: {
    ...DEFAULT_BACKGROUND,
    backgroundColor: '#ffffff',
  },
  other: {
    ...DEFAULT_SIZE,
    minWidth: '100%',
    minHeight: '100%',
    padding: '3px',
    display: 'inline-block',
  },
};

export const defaultContainerStyles: {
  [K in ContainerControls]: React.CSSProperties;
} & { other?: React.CSSProperties } = {
  indents: {
    ...DEFAULT_INDENTS,
    padding: '3px',
  },
  size: {
    ...DEFAULT_SIZE,
    minHeight: '50px',
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

export const defaultElementsGroupStyles: {
  [K in ElementsGroupControls]: React.CSSProperties;
} & { other?: React.CSSProperties } = {
  background: {
    ...DEFAULT_BACKGROUND,
  },
  indents: {
    ...DEFAULT_INDENTS,
    padding: '3px',
  },
};

export const defaultSectionStyles: {
  [K in ContainerControls]: React.CSSProperties;
} & { other?: React.CSSProperties } = {
  indents: {
    ...DEFAULT_INDENTS,
    padding: '3px',
  },
  size: {
    ...DEFAULT_SIZE,
    minHeight: '50px',
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
  [K in DivBlockControls]: React.CSSProperties;
} & { other?: React.CSSProperties } = {
  indents: {
    ...DEFAULT_INDENTS,
    padding: '3px',
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

export const defaultImageStyles: {
  [K in ImageControls]: React.CSSProperties;
} & {
  other?: React.CSSProperties;
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
  [K in SmartContainerControls]: React.CSSProperties;
} & { other?: React.CSSProperties } = {
  indents: {
    ...DEFAULT_INDENTS,
  },
  size: {
    ...DEFAULT_SIZE,
    minHeight: '48px',
  },
  display: {
    ...DEFAULT_DISPLAY,
  },
  typography: {
    ...DEFAULT_TYPOGRAPHY,
  },
  border: {
    ...DEFAULT_BORDER,
    borderColor: '#e7eaec',
  },
  background: {
    ...DEFAULT_BACKGROUND,
    backgroundColor: '#e0e0e0',
  },
};

export const defaultDropdownStyles: {
  [K in DropdownControls]: React.CSSProperties;
} & { other?: React.CSSProperties } = {
  indents: {
    ...DEFAULT_INDENTS,
  },
  size: {
    ...DEFAULT_SIZE,
  },
  typography: {
    ...DEFAULT_TYPOGRAPHY,
    color: '#ffffff',
    lineHeight: '1.75',
  },
  border: {
    ...DEFAULT_BORDER,
    borderColor: '#1890ff',
    borderRadius: '4px',
  },
  background: {
    ...DEFAULT_BACKGROUND,
    backgroundColor: '#1890ff',
  },
  other: {
    position: 'relative',
    display: 'inline-block',
  },
};

export const defaultDropdownMenuStyles: {
  [K in DropdownMenuControls]: React.CSSProperties;
} & { other?: React.CSSProperties } = {
  indents: {
    ...DEFAULT_INDENTS,
    padding: '3px 0',
  },
  size: {
    ...DEFAULT_SIZE,
  },
  border: {
    ...DEFAULT_BORDER,
    border: '1px solid #d9d9d9',
    borderRadius: '4px',
  },
  background: {
    ...DEFAULT_BACKGROUND,
    backgroundColor: '#ffffff',
  },
};

export const defaultDropdownItemStyles: {
  [K in DropdownItemControls]: React.CSSProperties;
} & { other?: React.CSSProperties } = {
  indents: {
    ...DEFAULT_INDENTS,
    padding: '6px 16px',
  },
  size: {
    ...DEFAULT_SIZE,
  },
  typography: {
    ...DEFAULT_TYPOGRAPHY,
    lineHeight: '1.5',
  },
  border: {
    ...DEFAULT_BORDER,
    borderWidth: '0px',
  },
  background: {
    ...DEFAULT_BACKGROUND,
    backgroundColor: '#ffffff',
  },
};

export const defaultVideoStyles: {
  [K in VideoControls]: React.CSSProperties;
} & {
  other?: React.CSSProperties;
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
  other: {
    aspectRatio: '16 / 9',
  },
};

export const defaultUndefinedStyles: {
  [K in UndefinedControls]: React.CSSProperties;
} & { other?: React.CSSProperties } = {
  size: {
    ...DEFAULT_SIZE,
    width: '100px',
    height: '100px',
  },
  background: {
    ...DEFAULT_BACKGROUND,
    backgroundColor: '#fff333',
  },
};

export const defaultGridItemStyles: {
  [K in GridItemControls]: React.CSSProperties;
} = {
  indents: {
    ...DEFAULT_INDENTS,
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
  [K in GridControls]: React.CSSProperties;
} & { other?: React.CSSProperties } = {
  indents: {
    ...DEFAULT_INDENTS,
  },
  size: {
    ...DEFAULT_SIZE,
    minHeight: '200px',
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
  grid: {
    display: 'grid',
    gridTemplateRows: 'repeat(2, 1fr)',
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
};

export const defaultColumnStyles: {
  [K in ColumnControls]: React.CSSProperties;
} & { other?: React.CSSProperties } = {
  indents: {
    ...DEFAULT_INDENTS,
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
  other: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '50%',
  },
};

export const defaultColumnsStyles: {
  [K in ColumnsControls]: React.CSSProperties;
} & { other?: React.CSSProperties } = {
  background: {
    ...DEFAULT_BACKGROUND,
  },
  border: {
    ...DEFAULT_BORDER,
  },
  indents: {
    ...DEFAULT_INDENTS,
  },
  typography: {
    ...DEFAULT_TYPOGRAPHY,
  },
  size: {
    ...DEFAULT_SIZE,
    minHeight: columnsMinHeight,
  },
  other: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'stretch',
    alignItems: 'stretch',
  },
};

export const defaultNativeColumnsStyles: {
  [K in NativeColumnsControls]: React.CSSProperties;
} = {
  nativeColumns: {
    columnCount: 2,
    columnWidth: 'auto',
    columnFill: 'balance',
    columnGap: '1em',
    columnRuleWidth: 'medium',
    columnRuleStyle: 'none',
    columnRuleColor: '#000',
  },
  indents: {
    ...DEFAULT_INDENTS,
  },
  size: {
    ...DEFAULT_SIZE,
    width: '100%',
    minHeight: columnsMinHeight,
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

type ButtonControls = typeof buttonStyleControls[number];
type TextinputControls = typeof textinputStyleControls[number];
type TextareaControls = typeof textareaStyleControls[number];
type CheckboxControls = typeof checkboxStyleControls[number];
type RadiobuttonControls = typeof radiobuttonStyleControls[number];
type RadiobuttonGroupControls = typeof radiobuttonGroupStyleControls[number];
type LabelControls = typeof labelStyleControls[number];
type SelectControls = typeof selectStyleControls[number];
type SelectMenuControls = typeof selectMenuStyleControls[number];
type OptionControls = typeof optionStyleControls[number];

export const defaultButtonStyles: {
  [K in ButtonControls]: React.CSSProperties;
} & {
  other?: React.CSSProperties;
} = {
  indents: {
    ...DEFAULT_INDENTS,
    padding: '2px 6px',
  },
  size: {
    ...DEFAULT_SIZE,
  },
  display: {
    display: 'inline-block',
  },
  typography: {
    ...DEFAULT_TYPOGRAPHY,
    textAlign: 'center',
  },
  border: {
    border: '1px solid #aaa',
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: '1px',
  },
  background: {
    ...DEFAULT_BACKGROUND,
    backgroundColor: '#efefef',
  },
};

export const defaultTextinputStyles: {
  [K in TextinputControls]: React.CSSProperties;
} & { other?: React.CSSProperties } = {
  indents: {
    ...DEFAULT_INDENTS,
    padding: '2px 6px',
  },
  size: {
    ...DEFAULT_SIZE,
  },
  typography: {
    ...DEFAULT_TYPOGRAPHY,
  },
  border: {
    ...DEFAULT_BORDER,
    border: '1px solid #aaa',
    borderRadius: '1px',
    borderColor: '#aaa',
    borderWidth: '1px',
  },
  background: {
    ...DEFAULT_BACKGROUND,
  },
};

export const defaultTextareaStyles: {
  [K in TextareaControls]: React.CSSProperties;
} & { other?: React.CSSProperties } = {
  indents: {
    ...DEFAULT_INDENTS,
    padding: '2px 6px',
  },
  size: {
    ...DEFAULT_SIZE,
  },
  typography: {
    ...DEFAULT_TYPOGRAPHY,
  },
  border: {
    ...DEFAULT_BORDER,
    border: '1px solid #aaa',
    borderRadius: '1px',
    borderColor: '#aaa',
    borderWidth: '1px',
  },
  background: {
    ...DEFAULT_BACKGROUND,
  },
};

export const defaultCheckboxStyles: {
  [K in CheckboxControls]: React.CSSProperties;
} & { other?: React.CSSProperties } = {
  indents: {
    ...DEFAULT_INDENTS,
  },
  size: {
    ...DEFAULT_SIZE,
  },
  background: {
    ...DEFAULT_BACKGROUND,
  },
};

export const defaultRadiobuttonStyles: {
  [K in RadiobuttonControls]: React.CSSProperties;
} & { other?: React.CSSProperties } = {
  indents: {
    ...DEFAULT_INDENTS,
  },
  size: {
    ...DEFAULT_SIZE,
  },
  background: {
    ...DEFAULT_BACKGROUND,
  },
};

export const defaultRadiobuttonGroupStyles: {
  [K in RadiobuttonGroupControls]: React.CSSProperties;
} & {
  other?: React.CSSProperties;
} = {
  indents: {
    ...DEFAULT_INDENTS,
  },
  size: {
    ...DEFAULT_SIZE,
  },
  background: {
    ...DEFAULT_BACKGROUND,
  },
  other: {
    display: 'flex',
    flexDirection: Alignments.Vertical,
  },
};

export const defaultLabelStyles: {
  [K in LabelControls]: React.CSSProperties;
} & {
  other?: React.CSSProperties;
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

export const defaultSelectStyles: {
  [K in SelectControls]: React.CSSProperties;
} & {
  other?: React.CSSProperties;
} = {
  indents: {
    ...DEFAULT_INDENTS,
  },
  size: {
    ...DEFAULT_SIZE,
    width: '200px',
  },
  typography: {
    ...DEFAULT_TYPOGRAPHY,
  },
  border: {
    ...DEFAULT_BORDER,
    border: '1px solid #aaa',
    borderRadius: '1px',
    borderColor: '#aaa',
    borderWidth: '1px',
  },
  background: {
    ...DEFAULT_BACKGROUND,
  },
};

export const defaultOptionStyles: {
  [K in OptionControls]: React.CSSProperties;
} & { other?: React.CSSProperties } = {
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

type pageTemplateControls = typeof pageTemplateStyleControls[number];
type subscribeFormControls = typeof subscribeFormStyleControls[number];
type cardsSectionControls = typeof cardsSectionStyleControls[number];
type featureSectionControls = typeof featureSectionStyleControls[number];

export const defaultPageTemplateStyles: {
  [K in pageTemplateControls]: React.CSSProperties;
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
    flexDirection: 'column',
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
  [K in pageTemplateControls]: React.CSSProperties;
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
    flexDirection: 'column',
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
  [K in subscribeFormControls]: React.CSSProperties;
} = {
  indents: {
    ...DEFAULT_INDENTS,
    padding: '100px 0',
  },
  size: {
    ...DEFAULT_SIZE,
    width: '100%',
  },
  display: {
    ...DEFAULT_DISPLAY,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
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
  [K in cardsSectionControls]: React.CSSProperties;
} = {
  indents: {
    ...DEFAULT_INDENTS,
    padding: '100px 0',
  },
  size: {
    ...DEFAULT_SIZE,
    width: '100%',
  },
  display: {
    ...DEFAULT_DISPLAY,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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
  [K in featureSectionControls]: React.CSSProperties;
} = {
  indents: {
    ...DEFAULT_INDENTS,
    padding: '100px 0',
  },
  size: {
    ...DEFAULT_SIZE,
    width: '100%',
  },
  display: {
    ...DEFAULT_DISPLAY,
    display: 'flex',
    justifyContent: 'center',
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

export const defaultHTMLElementStyles: {
  [K in HTMLElementControls]: React.CSSProperties;
} = {
  background: DEFAULT_BACKGROUND,
};

export const DEFAULT_ELEMENTS_STYLES: {
  [K in Entity]: { [key: string]: React.CSSProperties | undefined };
} = {
  root: defaultRootStyles,
  container: defaultContainerStyles,
  divBlock: defaultDivBlockStyles,
  pageTemplate: defaultPageTemplateStyles,
  emptyPageTemplate: defaultEmptyPageTemplateStyles,
  grid: defaultGridStyles,
  gridItem: defaultGridItemStyles,
  nativeColumns: defaultNativeColumnsStyles,
  columns: defaultColumnsStyles,
  column: defaultColumnStyles,
  button: defaultButtonStyles,
  textinput: defaultTextinputStyles,
  input: defaultTextinputStyles,
  textarea: defaultTextareaStyles,
  checkbox: defaultCheckboxStyles,
  radiobutton: defaultRadiobuttonStyles,
  radiobuttonGroup: defaultRadiobuttonGroupStyles,
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
  option: defaultOptionStyles,
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
  group: defaultElementsGroupStyles,
  html: defaultHTMLElementStyles,
};
