import {
  cardsSectionStyleControls,
  featureSectionStyleControls,
  pageTemplateStyleControls,
  subscribeFormStyleControls,
} from '../../core';
import {
  DEFAULT_BACKGROUND,
  DEFAULT_BORDER,
  DEFAULT_DISPLAY,
  DEFAULT_INDENTS,
  DEFAULT_SIZE,
  DEFAULT_TYPOGRAPHY,
} from '../../constants/defaultStyles';
import { CssLikeStyles } from '../../../utils/StyleHelper';

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
