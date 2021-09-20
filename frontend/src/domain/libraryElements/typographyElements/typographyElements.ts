import { HEADING_SETTINGS } from '@Components/RightPanel/PropertiesTab/Controls/HeadingType/constants';
import {
  ElementGroup,
  HeadingServerElement,
  HeadingType,
  ListItemServerElement,
  ListServerElement,
  OcrtextServerElement,
  ParagraphServerElement,
  TextBlockServerElement,
} from '@Src/types';
import { DEFAULT_LAYOUT_LIST } from '@Constants/defaultParams';
import ELEMENT_IDS from '@Constants/elementIds';
import { defaultFreeCanvasParams } from '../../core';

export const makeHeading = ({
  buoyancy = 0,
  textContent = 'Heading',
  headingType = 'h3' as HeadingType,
  ownStyles = {} as React.CSSProperties,
  UID = 'master',
} = {}): HeadingServerElement => ({
  id: `heading-${UID}`,
  buoyancy,
  func_type: 'heading',
  struct_type: 'heading',
  parameters: {
    layouts: DEFAULT_LAYOUT_LIST,
    freeCanvas: {
      ...defaultFreeCanvasParams,
      height: 74,
    },
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
    pseudoClassStyles: {},
  },
  name: 'heading',
  children: [],
});

export const makeParagraph = ({
  buoyancy = 0,
  textContent = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  ownStyles = {} as React.CSSProperties,
  UID = 'master',
} = {}): ParagraphServerElement => ({
  id: `paragraph-${UID}`,
  buoyancy,
  func_type: 'paragraph',
  struct_type: 'paragraph',
  parameters: {
    layouts: DEFAULT_LAYOUT_LIST,
    freeCanvas: {
      ...defaultFreeCanvasParams,
      height: 300,
    },
    group: ElementGroup.TYPOGRAPHY,
    textContent,
  },
  styles: {
    classNames: ['paragraph'],
    ownStyles,
    pseudoClassStyles: {},
  },
  name: 'paragraph',
  children: [],
});

export const makeOcrtext = (): OcrtextServerElement => ({
  id: 'ocrtext',
  buoyancy: 0,
  func_type: 'ocrtext',
  struct_type: 'ocrtext',
  parameters: {
    layouts: DEFAULT_LAYOUT_LIST,
    freeCanvas: {
      ...defaultFreeCanvasParams,
      height: 300,
    },
    group: ElementGroup.TYPOGRAPHY,
    textContent: 'This is a paragraph',
  },
  styles: {
    classNames: ['ocrtext'],
    ownStyles: {},
    pseudoClassStyles: {},
  },
  name: 'ocrtext',
  children: [],
});

export const makeTextBlock = (): TextBlockServerElement => ({
  id: ELEMENT_IDS.textBlock,
  buoyancy: 0,
  func_type: 'textBlock',
  struct_type: 'textBlock',
  parameters: {
    layouts: DEFAULT_LAYOUT_LIST,
    freeCanvas: {
      ...defaultFreeCanvasParams,
      height: 27,
    },
    group: ElementGroup.TYPOGRAPHY,
    textContent: 'This is a text block',
    isLink: false,
    link: '',
  },
  styles: {
    classNames: ['textBlock'],
    ownStyles: {},
    pseudoClassStyles: {},
  },
  name: 'textBlock',
  children: [],
});

export const makeListItem = ({
  textContent = 'New Item',
  UID = 'master',
  buoyancy = 0,
} = {}): ListItemServerElement => ({
  id: `list-item-${UID}`,
  buoyancy,
  func_type: 'listItem',
  struct_type: 'listItem',
  parameters: {
    layouts: DEFAULT_LAYOUT_LIST,
    freeCanvas: defaultFreeCanvasParams,
    group: ElementGroup.OTHER,
    textContent,
    isLink: false,
    link: '',
  },
  styles: {
    classNames: ['listItem'],
    ownStyles: {},
    pseudoClassStyles: {},
  },
  name: 'listItem',
  children: [],
});

export const makeList = ({
  items = [makeListItem(), makeListItem(), makeListItem()],
  UID = 'master',
}: {
  items?: ListItemServerElement[];
  UID?: string;
} = {}): ListServerElement => ({
  id: `list-${UID}`,
  buoyancy: 0,
  func_type: 'list',
  struct_type: 'list',
  parameters: {
    layouts: DEFAULT_LAYOUT_LIST,
    freeCanvas: {
      ...defaultFreeCanvasParams,
      height: 63,
    },
    group: ElementGroup.TYPOGRAPHY,
    listItems: items.map((item) => {
      const { textContent, isLink, link } = item.parameters;
      return {
        textContent,
        isLink: isLink || false,
        link: link || '',
      };
    }),

    isOrdered: false,
  },
  styles: {
    classNames: ['list'],
    ownStyles: {},
    pseudoClassStyles: {},
  },
  name: 'list',
  children: items,
});
