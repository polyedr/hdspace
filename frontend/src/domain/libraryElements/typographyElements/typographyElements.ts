import {
  HeadingServerElement,
  HeadingType,
  HyperlinkServerElement,
  ListItemServerElement,
  ListServerElement,
  OcrtextServerElement,
  ParagraphServerElement,
  TextBlockServerElement,
} from '../../../api/types';
import { CssLikeStyles } from '../../../utils/StyleHelper';

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
    ownStyles: {} as Required<CssLikeStyles>,
  },
  name: 'hyperlink',
  children: [],
};

export const makeHeading = ({
  buoyancy = 0,
  textContent = 'Heading',
  headingType = 'h3',
  ownStyles = {} as Required<CssLikeStyles>,
}: {
  textContent?: string;
  headingType?: HeadingType;
  buoyancy?: number;
  ownStyles?: Required<CssLikeStyles>;
} = {}): HeadingServerElement => ({
  buoyancy,
  func_type: 'heading',
  struct_type: 'heading',
  parameters: {
    group: 'typography',
    textContent,
    headingType,
  },
  styles: {
    classNames: ['heading'],
    ownStyles,
  },
  name: 'heading',
  children: [],
});

export const makeParagraph = ({
  buoyancy = 0,
  textContent = 'This is paragraph',
  ownStyles = {} as Required<CssLikeStyles>,
}: {
  buoyancy?: number;
  textContent?: string;
  ownStyles?: Required<CssLikeStyles>;
} = {}): ParagraphServerElement => ({
  buoyancy,
  func_type: 'paragraph',
  struct_type: 'paragraph',
  parameters: {
    group: 'typography',
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
    group: 'typography',
    textContent: 'This is paragraph',
  },
  styles: {
    classNames: ['ocrtext'],
    ownStyles: {} as Required<CssLikeStyles>,
  },
  name: 'ocrtext',
  children: [],
};

export const textBlock: TextBlockServerElement = {
  buoyancy: 0,
  func_type: 'textBlock',
  struct_type: 'textBlock',
  parameters: {
    group: 'typography',
    textContent: 'This is text block',
  },
  styles: {
    classNames: ['textBlock'],
    ownStyles: {} as Required<CssLikeStyles>,
  },
  name: 'textBlock',
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
    ownStyles: {} as Required<CssLikeStyles>,
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
    ownStyles: {} as Required<CssLikeStyles>,
  },
  name: 'list',
  children: [
    makeListItem('First item'),
    makeListItem('Second item'),
    makeListItem('Third item'),
  ],
};
