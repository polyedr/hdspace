import {
  DEFAULT_TYPOGRAPHY,
  DEFAULT_INDENTS,
  DEFAULT_SIZE,
  DEFAULT_DISPLAY,
  DEFAULT_BORDER,
  DEFAULT_BACKGROUND,
} from '$domain/constants/defaultStyles';
import {
  pageTemplateStyleControls,
  subscribeFormStyleControls,
  cardsSectionStyleControls,
  featureSectionStyleControls,
} from '$domain/core';
import { CssLikeStyles } from '$utils/StyleHelper';

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
