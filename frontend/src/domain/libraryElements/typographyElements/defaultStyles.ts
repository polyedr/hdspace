import {
  DEFAULT_BACKGROUND,
  DEFAULT_BORDER,
  DEFAULT_BULLETS,
  DEFAULT_DISPLAY,
  DEFAULT_INDENTS,
  DEFAULT_SIZE,
  DEFAULT_TYPOGRAPHY,
} from '../../constants/defaultStyles';
import {
  headingStyleControls,
  hyperlinkStyleControls,
  listItemStyleControls,
  listStyleControls,
  paragraphStyleControls,
  textBlockStyleControls,
} from '../../core';
import { CssLikeStyles } from '../../../utils/StyleHelper';

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

export const defaultHeadingStyles: { [K in HeadingControls]: CssLikeStyles } & {
  other?: CssLikeStyles;
} = {
  indents: {
    ...DEFAULT_INDENTS,
    'margin-top': '20px',
    'margin-bottom': '10px',
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
    'margin-bottom': '12px',
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

export const defaultTextBlockStyles: {
  [K in TextBlockControls]: CssLikeStyles;
} & { other?: CssLikeStyles } = {
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

export const defaultListStyles: { [K in ListControls]: CssLikeStyles } & {
  other?: CssLikeStyles;
} = {
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

export const defaultListItemStyles: {
  [K in ListItemControls]: CssLikeStyles;
} & { other?: CssLikeStyles } = {
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
