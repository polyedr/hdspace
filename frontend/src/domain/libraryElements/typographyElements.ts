import {
  HyperlinkServerElement,
  HeadingServerElement,
  ParagraphServerElement,
  OcrtextServerElement,
  TextBlockServerElement,
  ListItemServerElement,
  ListServerElement,
} from '$api/types';

export const hyperlink: HyperlinkServerElement = {
  buoyancy: 0,
  func_type: 'hyperlink',
  struct_type: 'hyperlink',
  parameters: {
    group: 'other',
    textContent: 'hyperlink',
    action: {
      type: 'internal-link',
      screenID: 'noScreen',
    },
  },
  styles: {
    classNames: ['hyperlink'],
    ownStyles: {},
  },
  name: 'hyperlink',
  children: [],
};

export const heading: HeadingServerElement = {
  buoyancy: 0,
  func_type: 'heading',
  struct_type: 'heading',
  parameters: {
    group: 'typography',
    textContent: 'Heading',
    headingType: 'h3',
  },
  styles: {
    classNames: ['heading'],
    ownStyles: {},
  },
  name: 'heading',
  children: [],
};

export const paragraph: ParagraphServerElement = {
  buoyancy: 0,
  func_type: 'paragraph',
  struct_type: 'paragraph',
  parameters: {
    group: 'typography',
    textContent: 'This is paragraph',
  },
  styles: {
    classNames: ['paragraph'],
    ownStyles: {},
  },
  name: 'paragraph',
  children: [],
};

export const ocrtext: OcrtextServerElement = {
  buoyancy: 0,
  func_type: 'ocrtext',
  struct_type: 'ocrtext',
  parameters: {
    group: 'typography',
    textContent: 'This is paragraph',
  },
  styles: {
    classNames: ['ocrtext'],
    ownStyles: {},
  },
  name: 'ocrtext',
  children: [],
};

export const text_block: TextBlockServerElement = {
  buoyancy: 0,
  func_type: 'text_block', // TODO rename in camelCase
  struct_type: 'text_block',
  parameters: {
    group: 'typography',
    textContent: 'This is text block',
  },
  styles: {
    classNames: ['text_block'],
    ownStyles: {},
  },
  name: 'text_block',
  children: [],
};

export const makeListItem = (textContent: string): ListItemServerElement => ({
  buoyancy: 0,
  func_type: 'listItem',
  struct_type: 'listItem',
  parameters: {
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
    group: 'typography',
    listItems: [ // TODO research why we need items here
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
