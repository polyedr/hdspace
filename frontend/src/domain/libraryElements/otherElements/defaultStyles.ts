import {
  containerStyleControls,
  divBlockStyleControls,
  dropdownItemStyleControls,
  dropdownMenuStyleControls,
  dropdownStyleControls,
  imageStyleControls,
  rootStyleControls,
  screenshotStyleControls,
  undefinedControls,
  videoStyleControls,
} from '../../core';
import {
  DEFAULT_BACKGROUND,
  DEFAULT_BACKGROUND_POSITION,
  DEFAULT_BACKGROUND_SIZE,
  DEFAULT_BORDER,
  DEFAULT_DISPLAY,
  DEFAULT_FLEX_GROW,
  DEFAULT_INDENTS,
  DEFAULT_SIZE,
  DEFAULT_TYPOGRAPHY,
} from '../../constants/defaultStyles';
import { CssLikeStyles } from '../../../utils/StyleHelper';

type RootControls = typeof rootStyleControls[number];
type ContainerControls = typeof containerStyleControls[number];
type DivBlockControls = typeof divBlockStyleControls[number];
type ImageControls = typeof imageStyleControls[number];
type ScreenshotControls = typeof screenshotStyleControls[number];
type DropdownControls = typeof dropdownStyleControls[number];
type DropdownMenuControls = typeof dropdownMenuStyleControls[number];
type DropdownItemControls = typeof dropdownItemStyleControls[number];
type VideoControls = typeof videoStyleControls[number];
type UndefinedControls = typeof undefinedControls[number];

export const defaultRootStyles: { [K in RootControls]: CssLikeStyles } & {
  other?: CssLikeStyles;
} = {
  background: {
    ...DEFAULT_BACKGROUND,
    'background-color': '#ffffff',
  },
  other: {
    ...DEFAULT_SIZE,
    width: '100%',
    height: '100%',
    'min-height': '100%',
    'min-width': '100%',
    'padding-top': '3px',
    'padding-left': '3px',
    'padding-bottom': '3px',
    'padding-right': '3px',
  },
};

export const defaultContainerStyles: {
  [K in ContainerControls]: CssLikeStyles;
} & { other?: CssLikeStyles } = {
  indents: {
    ...DEFAULT_INDENTS,
    'padding-top': '3px',
    'padding-left': '3px',
    'padding-bottom': '3px',
    'padding-right': '3px',
  },
  size: {
    ...DEFAULT_SIZE,
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
  flexGrow: {
    ...DEFAULT_FLEX_GROW,
  },
};

export const defaultSectionStyles: {
  [K in ContainerControls]: CssLikeStyles;
} & { other?: CssLikeStyles } = {
  indents: {
    ...DEFAULT_INDENTS,
    'padding-top': '3px',
    'padding-left': '3px',
    'padding-bottom': '3px',
    'padding-right': '3px',
  },
  size: {
    ...DEFAULT_SIZE,
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
  flexGrow: {
    ...DEFAULT_FLEX_GROW,
  },
};

export const defaultDivBlockStyles: {
  [K in DivBlockControls]: CssLikeStyles;
} & { other?: CssLikeStyles } = {
  indents: {
    ...DEFAULT_INDENTS,
    'padding-top': '3px',
    'padding-left': '3px',
    'padding-bottom': '3px',
    'padding-right': '3px',
  },
  size: {
    ...DEFAULT_SIZE,
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

export const defaultImageStyles: { [K in ImageControls]: CssLikeStyles } & {
  other?: CssLikeStyles;
} = {
  indents: {
    ...DEFAULT_INDENTS,
  },
  size: {
    ...DEFAULT_SIZE,
  },
  border: {
    ...DEFAULT_BORDER,
  },
  background: {
    ...DEFAULT_BACKGROUND,
  },
};

export const defaultScreenshotStyles: {
  [K in ScreenshotControls]: CssLikeStyles;
} = {
  indents: {
    ...DEFAULT_INDENTS,
  },
  size: {
    ...DEFAULT_SIZE,
    height: '100%',
  },
  border: {
    ...DEFAULT_BORDER,
  },
  background: {
    ...DEFAULT_BACKGROUND,
  },
  backgroundPosition: {
    ...DEFAULT_BACKGROUND_POSITION,
  },
  backgroundSize: {
    ...DEFAULT_BACKGROUND_SIZE,
  },
};

export const defaultDropdownStyles: {
  [K in DropdownControls]: CssLikeStyles;
} & { other?: CssLikeStyles } = {
  indents: {
    ...DEFAULT_INDENTS,
    'padding-top': '6px',
    'padding-right': '16px',
    'padding-bottom': '6px',
    'padding-left': '16px',
  },
  size: {
    ...DEFAULT_SIZE,
  },
  typography: {
    ...DEFAULT_TYPOGRAPHY,
    color: '#ffffff',
    'line-height': '1.75',
  },
  border: {
    ...DEFAULT_BORDER,
    'border-color': '#1890ff',
    'border-radius': '4px',
  },
  background: {
    ...DEFAULT_BACKGROUND,
    'background-color': '#1890ff',
  },
  other: {
    display: 'inline-block',
  },
};

export const defaultDropdownMenuStyles: {
  [K in DropdownMenuControls]: CssLikeStyles;
} & { other?: CssLikeStyles } = {
  indents: {
    ...DEFAULT_INDENTS,
  },
  size: {
    ...DEFAULT_SIZE,
  },
  border: {
    ...DEFAULT_BORDER,
    'border-color': '#d9d9d9',
    'border-width': '1px',
    'border-style': 'solid',
    'border-radius': '4px',
  },
  background: {
    ...DEFAULT_BACKGROUND,
    'background-color': '#ffffff',
  },
};

export const defaultDropdownItemStyles: {
  [K in DropdownItemControls]: CssLikeStyles;
} & { other?: CssLikeStyles } = {
  indents: {
    ...DEFAULT_INDENTS,
    'padding-top': '6px',
    'padding-right': '16px',
    'padding-bottom': '6px',
    'padding-left': '16px',
  },
  size: {
    ...DEFAULT_SIZE,
  },
  typography: {
    ...DEFAULT_TYPOGRAPHY,
    'line-height': '1.5',
  },
  border: {
    ...DEFAULT_BORDER,
    'border-width': '0px',
  },
  background: {
    ...DEFAULT_BACKGROUND,
    'background-color': '#ffffff',
  },
};

export const defaultVideoStyles: { [K in VideoControls]: CssLikeStyles } & {
  other?: CssLikeStyles;
} = {
  indents: {
    ...DEFAULT_INDENTS,
  },
  size: {
    ...DEFAULT_SIZE,
    height: 'auto',
  },
  border: {
    ...DEFAULT_BORDER,
  },
};

export const defaultUndefinedStyles: {
  [K in UndefinedControls]: CssLikeStyles;
} & { other?: CssLikeStyles } = {
  size: {
    ...DEFAULT_SIZE,
    width: '100px',
    height: '100px',
  },
  background: {
    ...DEFAULT_BACKGROUND,
    'background-color': '#fff333',
  },
};
