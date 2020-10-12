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
    // Indents need to prevent margin collapsing
    'padding-top': '1px',
    'padding-bottom': '1px',
  },
};

export const defaultContainerStyles: {
  [K in ContainerControls]: CssLikeStyles;
} & { other?: CssLikeStyles } = {
  indents: {
    ...DEFAULT_INDENTS,
    'margin-top': '3px',
    'margin-left': '3px',
    'margin-bottom': '3px',
    'margin-right': '3px',
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
  flexGrow: {
    ...DEFAULT_FLEX_GROW,
  },
};

export const defaultSectionStyles: {
  [K in ContainerControls]: CssLikeStyles;
} & { other?: CssLikeStyles } = {
  indents: {
    ...DEFAULT_INDENTS,
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
  flexGrow: {
    ...DEFAULT_FLEX_GROW,
  },
};

export const defaultDivBlockStyles: {
  [K in DivBlockControls]: CssLikeStyles;
} & { other?: CssLikeStyles } = {
  indents: {
    ...DEFAULT_INDENTS,
  },
  size: {
    ...DEFAULT_SIZE,
    width: '100%',
    height: '150px',
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
    'padding-top': '0',
    'padding-right': '0',
    'padding-bottom': '0',
    'padding-left': '0',
  },
  size: {
    ...DEFAULT_SIZE,
    width: 'auto',
    height: 'auto',
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
    width: '100%',
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
    'padding-top': '0px',
    'padding-right': '0px',
    'padding-bottom': '0px',
    'padding-left': '0px',
    'margin-top': '0px',
    'margin-right': '0px',
    'margin-bottom': '0px',
    'margin-left': '0px',
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
    'padding-top': '0',
    'padding-right': '0',
    'padding-bottom': '0',
    'padding-left': '0',
  },
  size: {
    ...DEFAULT_SIZE,
    width: '100%',
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
