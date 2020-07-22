import {
  HyperlinkServerElement,
  HeadingServerElement,
  ParagraphServerElement,
  OcrtextServerElement,
  TextBlockServerElement,
  ListItemServerElement,
  ListServerElement,
} from '$api/types';
import { getDefaultStyles } from '$domain/defaultStyles/defaultStyles';
import {
  defaultHyperlinkParams,
  defaultHeadingParams,
  defaultParagraphParams,
  defaultTextBlockParams,
  defaultListParams,
} from '$domain/defaultParams/defaultParams';

export const hyperlink: HyperlinkServerElement = {
  buoyancy: 0,
  func_type: 'hyperlink',
  struct_type: 'hyperlink',
  parameters: {
    group: 'other',
    ...defaultHyperlinkParams,
  },
  styles: {
    classNames: [],
    tagStyles: getDefaultStyles('hyperlink'),
    idStyles: {},
    classStyles: {},
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
    ...defaultHeadingParams,
  },
  styles: {
    classNames: [],
    tagStyles: getDefaultStyles('heading'),
    idStyles: {},
    classStyles: {},
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
    ...defaultParagraphParams,
  },
  styles: {
    classNames: [],
    tagStyles: getDefaultStyles('paragraph'),
    idStyles: {},
    classStyles: {},
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
    ...defaultParagraphParams,
  },
  styles: {
    classNames: [],
    tagStyles: getDefaultStyles('ocrtext'),
    idStyles: {},
    classStyles: {},
  },
  name: 'ocrtext',
  children: [],
};

export const text_block: TextBlockServerElement = {
  buoyancy: 0,
  func_type: 'text_block',
  struct_type: 'text_block',
  parameters: {
    group: 'typography',
    ...defaultTextBlockParams,
  },
  styles: {
    classNames: [],
    tagStyles: getDefaultStyles('text_block'),
    idStyles: {},
    classStyles: {},
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
    classNames: [],
    tagStyles: getDefaultStyles('listItem'),
    idStyles: {},
    classStyles: {},
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
    ...defaultListParams,
  },
  styles: {
    classNames: [],
    tagStyles: getDefaultStyles('list'),
    idStyles: {},
    classStyles: {},
  },
  name: 'list',
  children: [
    makeListItem('First item'),
    makeListItem('Second item'),
    makeListItem('Third item'),
  ],
};
