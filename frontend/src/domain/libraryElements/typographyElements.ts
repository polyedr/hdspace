import {
  HyperlinkServerElement,
  HeadingServerElement,
  ParagraphServerElement,
  OcrtextServerElement,
  TextBlockServerElement,
  ListItemServerElement,
  ListServerElement,
} from '$api/types';

export const hyperlink: Omit<HyperlinkServerElement, 'parameters'> & { parameters: { group: string } } = {
  buoyancy: 2,
  func_type: 'hyperlink',
  struct_type: 'hyperlink',
  parameters: {
    group: 'other',
  },
  styles: {},
  name: 'hyperlink',
  children: [],
};

export const heading: Omit<HeadingServerElement, 'parameters'> & { parameters: { group: string } } = {
  buoyancy: 0,
  func_type: 'heading',
  struct_type: 'heading',
  parameters: {
    group: 'typography',
  },
  styles: {},
  name: 'heading',
  children: [],
};

export const paragraph: Omit<ParagraphServerElement, 'parameters'> & { parameters: { group: string } } = {
  buoyancy: 0,
  func_type: 'paragraph',
  struct_type: 'paragraph',
  parameters: {
    group: 'typography',
  },
  styles: {},
  name: 'paragraph',
  children: [],
};

export const ocrtext: Omit<OcrtextServerElement, 'parameters'> & { parameters: { group: string } } = {
  buoyancy: 0,
  func_type: 'ocrtext',
  struct_type: 'ocrtext',
  parameters: {
    group: 'typography',
  },
  styles: {},
  name: 'ocrtext',
  children: [],
};

export const text_block: Omit<TextBlockServerElement, 'parameters'> & { parameters: { group: string } } = {
  buoyancy: 0,
  func_type: 'text_block',
  struct_type: 'text_block',
  parameters: {
    group: 'typography',
  },
  styles: {},
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
  styles: {},
  name: 'listItem',
  children: [],
});

export const list: Omit<ListServerElement, 'parameters'> & { parameters: { group: string } } = {
  buoyancy: 0,
  func_type: 'list',
  struct_type: 'list',
  parameters: {
    group: 'typography',
  },
  styles: {},
  name: 'list',
  children: [
    makeListItem('First item'),
    makeListItem('Second item'),
    makeListItem('Third item'),
  ],
};
