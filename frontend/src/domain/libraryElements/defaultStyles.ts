import { Alignments, Entity } from '@Src/types';
import React from 'react';
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
  paginationStyleControls,
  radiobuttonGroupStyleControls,
  switchStyleControls,
  listImagesItemStyleControls,
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
};

export const DEFAULT_POSITION: React.CSSProperties = {
  position: 'static',
  float: 'none',
  clear: 'none',
  inset: 'unset',
  zIndex: 'auto',
};

export const DEFAULT_BACKGROUND_IMAGE: React.CSSProperties = {
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

export const DEFAULT_OPACITY: React.CSSProperties = {
  opacity: 1,
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
  lineHeight: '150%',
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
  opacity: {
    ...DEFAULT_OPACITY,
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
  opacity: {
    ...DEFAULT_OPACITY,
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
  opacity: {
    ...DEFAULT_OPACITY,
  },
};

type HeadingControls = typeof headingStyleControls[number];
type ParagraphControls = typeof paragraphStyleControls[number];
type TextBlockControls = typeof textBlockStyleControls[number];
type ListControls = typeof listStyleControls[number];
type ListItemControls = typeof listItemStyleControls[number];
type PaginationControls = typeof paginationStyleControls[number];
type ImagesListControls = typeof listImagesItemStyleControls[number];

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
  opacity: {
    ...DEFAULT_OPACITY,
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
  opacity: {
    ...DEFAULT_OPACITY,
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
  position: {
    ...DEFAULT_POSITION,
  },
  other: {
    outline: 0,
  },
  opacity: {
    ...DEFAULT_OPACITY,
  },
};

export const defaultListStyles: { [K in ListControls]: React.CSSProperties } & {
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
  opacity: {
    ...DEFAULT_OPACITY,
  },
};
export const defaultBreadcrumbStyles: {
  [K in PaginationControls]: React.CSSProperties;
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
  },
  border: {
    ...DEFAULT_BORDER,
  },
  background: {
    ...DEFAULT_BACKGROUND,
  },
  opacity: {
    ...DEFAULT_OPACITY,
  },
};
export const defaultPaginationStyles: {
  [K in PaginationControls]: React.CSSProperties;
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
  },
  border: {
    ...DEFAULT_BORDER,
  },
  background: {
    ...DEFAULT_BACKGROUND,
  },
  opacity: {
    ...DEFAULT_OPACITY,
  },
};
export const defaultCarouselStyles: {
  [K in PaginationControls]: React.CSSProperties;
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
  },
  border: {
    ...DEFAULT_BORDER,
  },
  background: {
    ...DEFAULT_BACKGROUND,
  },
  opacity: {
    ...DEFAULT_OPACITY,
  },
};
export const defaultNavbarStyles: {
  [K in PaginationControls]: React.CSSProperties;
} & {
  other?: React.CSSProperties;
} = {
  indents: {
    ...DEFAULT_INDENTS,
  },
  size: {
    ...DEFAULT_SIZE,
    height: '50px',
  },
  display: {
    ...DEFAULT_DISPLAY,
  },
  border: {
    ...DEFAULT_BORDER,
  },
  background: {
    ...DEFAULT_BACKGROUND,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  opacity: {
    ...DEFAULT_OPACITY,
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
  border: {
    ...DEFAULT_BORDER,
  },
  background: {
    ...DEFAULT_BACKGROUND,
  },
  other: {
    outline: 0,
  },
  opacity: {
    ...DEFAULT_OPACITY,
  },
};

export const defaultImagesListItemStyles: {
  [K in ImagesListControls]: React.CSSProperties;
} & { other?: React.CSSProperties } = {
  indents: {
    ...DEFAULT_INDENTS,
  },
  size: {
    ...DEFAULT_SIZE,
    width: '500px',
    height: '450px',
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
  backgroundImage: {
    ...DEFAULT_BACKGROUND_IMAGE,
  },
  other: {
    outline: 0,
    alignItems: 'center',
  },
  opacity: {
    ...DEFAULT_OPACITY,
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
  backgroundImage: {
    ...DEFAULT_BACKGROUND_IMAGE,
  },
  flexGrow: {
    ...DEFAULT_FLEX_GROW,
  },
  opacity: {
    ...DEFAULT_OPACITY,
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
  opacity: {
    ...DEFAULT_OPACITY,
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
  backgroundImage: {
    ...DEFAULT_BACKGROUND_IMAGE,
  },
  flexGrow: {
    ...DEFAULT_FLEX_GROW,
  },
  opacity: {
    ...DEFAULT_OPACITY,
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
  backgroundImage: {
    ...DEFAULT_BACKGROUND_IMAGE,
  },
  opacity: {
    ...DEFAULT_OPACITY,
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
  opacity: {
    ...DEFAULT_OPACITY,
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
  opacity: {
    ...DEFAULT_OPACITY,
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
  opacity: {
    ...DEFAULT_OPACITY,
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
  opacity: {
    ...DEFAULT_OPACITY,
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
  opacity: {
    ...DEFAULT_OPACITY,
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
  opacity: {
    ...DEFAULT_OPACITY,
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
  backgroundImage: {
    ...DEFAULT_BACKGROUND_IMAGE,
  },
  opacity: {
    ...DEFAULT_OPACITY,
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
  opacity: {
    ...DEFAULT_OPACITY,
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
  opacity: {
    ...DEFAULT_OPACITY,
  },
};

export const defaultColumnsStyles: {
  [K in ColumnsControls]: React.CSSProperties;
} & { other?: React.CSSProperties } = {
  background: {
    ...DEFAULT_BACKGROUND,
  },
  backgroundImage: {
    ...DEFAULT_BACKGROUND_IMAGE,
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
  opacity: {
    ...DEFAULT_OPACITY,
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
  opacity: {
    ...DEFAULT_OPACITY,
  },
};

type ButtonControls = typeof buttonStyleControls[number];
type TextinputControls = typeof textinputStyleControls[number];
type TextareaControls = typeof textareaStyleControls[number];
type CheckboxControls = typeof checkboxStyleControls[number];
type SwitchControls = typeof switchStyleControls[number];
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
  backgroundImage: {
    ...DEFAULT_BACKGROUND_IMAGE,
  },
  opacity: {
    ...DEFAULT_OPACITY,
  },
};

export const defaultTextInputStyles: {
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
  opacity: {
    ...DEFAULT_OPACITY,
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
  opacity: {
    ...DEFAULT_OPACITY,
  },
};

export const defaultSliderStyles = {};

export const defaultDateTimePickerStyles: {
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
  opacity: {
    ...DEFAULT_OPACITY,
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
  opacity: {
    ...DEFAULT_OPACITY,
  },
};
export const defaultSwitchStyles: {
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
  opacity: {
    ...DEFAULT_OPACITY,
  },
};

export const defaultRadiobuttonStyles: {
  [K in RadiobuttonControls]: React.CSSProperties;
} & { other?: React.CSSProperties } = {
  indents: {
    ...DEFAULT_INDENTS,
    margin: '3px',
  },
  size: {
    ...DEFAULT_SIZE,
  },
  background: {
    ...DEFAULT_BACKGROUND,
  },
  opacity: {
    ...DEFAULT_OPACITY,
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
  opacity: {
    ...DEFAULT_OPACITY,
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
  opacity: {
    ...DEFAULT_OPACITY,
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
  opacity: {
    ...DEFAULT_OPACITY,
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
  opacity: {
    ...DEFAULT_OPACITY,
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
  opacity: {
    ...DEFAULT_OPACITY,
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
  opacity: {
    ...DEFAULT_OPACITY,
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
  opacity: {
    ...DEFAULT_OPACITY,
  },
};

export const defaultButtonGeneratorStyles: {
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
  opacity: {
    ...DEFAULT_OPACITY,
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
  opacity: {
    ...DEFAULT_OPACITY,
  },
};

export const defaultFeatureSectionStyles: {
  [K in featureSectionControls]: React.CSSProperties;
} = {
  opacity: {
    ...DEFAULT_OPACITY,
  },
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
  buttonGenerator: defaultButtonGeneratorStyles,
  textinput: defaultTextInputStyles,
  input: defaultTextInputStyles,
  textarea: defaultTextareaStyles,
  slider: defaultSliderStyles,
  dateTimePicker: defaultDateTimePickerStyles,
  checkbox: defaultCheckboxStyles,
  switch: defaultSwitchStyles,
  radiobutton: defaultRadiobuttonStyles,
  radiobuttonGroup: defaultRadiobuttonGroupStyles,
  label: defaultLabelStyles,
  heading: defaultHeadingStyles,
  paragraph: defaultParagraphStyles,
  ocrtext: defaultParagraphStyles,
  textBlock: defaultTextBlockStyles,
  list: defaultListStyles,
  listItem: defaultListItemStyles,
  image: defaultImageStyles,
  imagesList: defaultImagesListItemStyles,
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
  subscribeForm: defaultSubscribeFormStyles,
  cardsSection: defaultCardsSectionStyles,
  featureSection: defaultFeatureSectionStyles,
  section: defaultSectionStyles,
  group: defaultElementsGroupStyles,
  html: defaultHTMLElementStyles,
  breadcrumb: defaultBreadcrumbStyles,
  breadcrumbItem: defaultListItemStyles,
  pagination: defaultPaginationStyles,
  paginationItem: defaultListItemStyles,
  carousel: defaultCarouselStyles,
  carouselItem: defaultListItemStyles,
  navbar: defaultNavbarStyles,
  navbarItem: defaultListItemStyles,
  hyperlink: defaultLabelStyles,
};
