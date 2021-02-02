import { HEADING_SETTINGS } from '@Components/RightPanel/PropertiesTab/Controls/HeadingType/constants';
import {
  ElementGroup,
  HeadingServerElement,
  HeadingType,
  HyperlinkServerElement,
  ListItemServerElement,
  ListServerElement,
  OcrtextServerElement,
  ParagraphServerElement,
  TextBlockServerElement,
} from '@Src/types';
import { defaultFreeCanvasParams } from '../../core';

export const hyperlink: HyperlinkServerElement = {
  buoyancy: 0,
  func_type: 'hyperlink',
  struct_type: 'hyperlink',
  parameters: {
    ...defaultFreeCanvasParams,
    group: ElementGroup.OTHER,
    textContent: 'hyperlink',
    events: [],
  },
  styles: {
    classNames: ['hyperlink'],
    ownStyles: {},
  },
  name: 'hyperlink',
  children: [],
};

export const makeHeading = ({
  buoyancy = 0,
  textContent = 'Heading',
  headingType = 'h3',
  ownStyles = {} as React.CSSProperties,
}: {
  textContent?: string;
  headingType?: HeadingType;
  buoyancy?: number;
  ownStyles?: React.CSSProperties;
} = {}): HeadingServerElement => ({
  buoyancy,
  func_type: 'heading',
  struct_type: 'heading',
  parameters: {
    ...defaultFreeCanvasParams,
    group: ElementGroup.TYPOGRAPHY,
    textContent,
    headingType,
  },
  styles: {
    classNames: ['heading'],
    ownStyles: {
      fontSize: HEADING_SETTINGS[headingType].fontSize,
      ...ownStyles,
    },
  },
  name: 'heading',
  children: [],
});

export const makeParagraph = ({
  buoyancy = 0,
  textContent = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  ownStyles = {} as React.CSSProperties,
}: {
  buoyancy?: number;
  textContent?: string;
  ownStyles?: React.CSSProperties;
} = {}): ParagraphServerElement => ({
  buoyancy,
  func_type: 'paragraph',
  struct_type: 'paragraph',
  parameters: {
    ...defaultFreeCanvasParams,
    group: ElementGroup.TYPOGRAPHY,
    textContent,
  },
  styles: {
    classNames: ['paragraph'],
    ownStyles,
  },
  name: 'paragraph',
  children: [],
});

export const ocrtext: OcrtextServerElement = {
  buoyancy: 0,
  func_type: 'ocrtext',
  struct_type: 'ocrtext',
  parameters: {
    ...defaultFreeCanvasParams,
    group: ElementGroup.TYPOGRAPHY,
    textContent: 'This is paragraph',
  },
  styles: {
    classNames: ['ocrtext'],
    ownStyles: {},
  },
  name: 'ocrtext',
  children: [],
};

export const textBlock: TextBlockServerElement = {
  buoyancy: 0,
  func_type: 'textBlock',
  struct_type: 'textBlock',
  parameters: {
    ...defaultFreeCanvasParams,
    group: ElementGroup.TYPOGRAPHY,
    textContent: 'This is text block',
  },
  styles: {
    classNames: ['textBlock'],
    ownStyles: {},
  },
  name: 'textBlock',
  children: [],
};

export const makeListItem = (textContent: string): ListItemServerElement => ({
  buoyancy: 0,
  func_type: 'listItem',
  struct_type: 'listItem',
  parameters: {
    ...defaultFreeCanvasParams,
    textContent,
    isLink: false,
    link: '',
  },
  styles: {
    classNames: ['listItem'],
    ownStyles: {},
  },
  name: 'listItem',
  children: [],
});

export const list: ListServerElement = {
  buoyancy: 0,
  func_type: 'list',
  struct_type: 'list',
  parameters: {
    ...defaultFreeCanvasParams,
    group: ElementGroup.TYPOGRAPHY,
    listItems: [
      // TODO research why we need items here
      { textContent: 'First item', isLink: false, link: '' },
      { textContent: 'Second item', isLink: false, link: '' },
      { textContent: 'Third item', isLink: false, link: '' },
    ],
    isOrdered: false,
  },
  styles: {
    classNames: ['list'],
    ownStyles: {},
  },
  name: 'list',
  children: [
    makeListItem('First item'),
    makeListItem('Second item'),
    makeListItem('Third item'),
  ],
};
