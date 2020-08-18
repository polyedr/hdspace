import {
  DEFAULT_TYPOGRAPHY,
  DEFAULT_INDENTS,
  DEFAULT_SIZE,
  DEFAULT_DISPLAY,
  DEFAULT_BORDER,
  DEFAULT_BACKGROUND,
} from '$domain/constants/defaultStyles';
import { pageTemplateStyleControls } from '$domain/core';
import { CssLikeStyles } from '$utils/StyleHelper';

type pageTemplateControls = typeof pageTemplateStyleControls[number];

export const defaultPageTemplateStyles: {
  [K in pageTemplateControls]: CssLikeStyles;
} = {
  indents: {
    ...DEFAULT_INDENTS, // TODO remove styles controls from pageTemplate
  },
  size: {
    ...DEFAULT_SIZE,
    width: '100%',
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
