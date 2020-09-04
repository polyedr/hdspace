import {
  DEFAULT_BACKGROUND,
  DEFAULT_BORDER,
  DEFAULT_DISPLAY,
  DEFAULT_INDENTS,
  DEFAULT_SIZE,
  DEFAULT_TYPOGRAPHY,
} from '../../constants/defaultStyles';
import {
  buttonStyleControls,
  checkboxStyleControls,
  labelStyleControls,
  radiobuttonStyleControls,
  selectItemStyleControls,
  selectMenuStyleControls,
  selectStyleControls,
  textareaStyleControls,
  textinputStyleControls,
} from '../../core';
import { CssLikeStyles } from '../../../utils/StyleHelper';

type ButtonControls = typeof buttonStyleControls[number];
type TextinputControls = typeof textinputStyleControls[number];
type TextareaControls = typeof textareaStyleControls[number];
type CheckboxControls = typeof checkboxStyleControls[number];
type RadiobuttonControls = typeof radiobuttonStyleControls[number];
type LabelControls = typeof labelStyleControls[number];
type SelectControls = typeof selectStyleControls[number];
type SelectMenuControls = typeof selectMenuStyleControls[number];
type SelectItemControls = typeof selectItemStyleControls[number];

export const defaultButtonStyles: { [K in ButtonControls]: CssLikeStyles } & {
  other?: CssLikeStyles;
} = {
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
  display: {
    ...DEFAULT_DISPLAY,
    display: 'inline-block',
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
};

export const defaultTextinputStyles: {
  [K in TextinputControls]: CssLikeStyles;
} & { other?: CssLikeStyles } = {
  indents: {
    ...DEFAULT_INDENTS,
    'padding-top': '18.5px',
    'padding-right': '14px',
    'padding-bottom': '18.5px',
    'padding-left': '14px',
  },
  size: {
    ...DEFAULT_SIZE,
  },
  typography: {
    ...DEFAULT_TYPOGRAPHY,
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
  },
};

export const defaultTextareaStyles: {
  [K in TextareaControls]: CssLikeStyles;
} & { other?: CssLikeStyles } = {
  indents: {
    ...DEFAULT_INDENTS,
    'padding-top': '18.5px',
    'padding-right': '14px',
    'padding-bottom': '18.5px',
    'padding-left': '14px',
  },
  size: {
    ...DEFAULT_SIZE,
  },
  typography: {
    ...DEFAULT_TYPOGRAPHY,
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
  },
};

export const defaultCheckboxStyles: {
  [K in CheckboxControls]: CssLikeStyles;
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
    width: '24px',
    height: 'auto',
  },
  background: {
    ...DEFAULT_BACKGROUND,
    'background-color': '#1890ff',
  },
};

export const defaultRadiobuttonStyles: {
  [K in RadiobuttonControls]: CssLikeStyles;
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
    width: '24px',
    height: 'auto',
  },
  background: {
    ...DEFAULT_BACKGROUND,
    'background-color': '#1890ff',
  },
};

export const defaultLabelStyles: { [K in LabelControls]: CssLikeStyles } & {
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
  },
  display: {
    ...DEFAULT_DISPLAY,
    display: 'inline',
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

export const defaultSelectStyles: { [K in SelectControls]: CssLikeStyles } & {
  other?: CssLikeStyles;
} = {
  indents: {
    ...DEFAULT_INDENTS,
    'padding-top': '18.5px',
    'padding-right': '14px',
    'padding-bottom': '18.5px',
    'padding-left': '14px',
  },
  size: {
    ...DEFAULT_SIZE,
  },
  typography: {
    ...DEFAULT_TYPOGRAPHY,
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
  },
};

export const defaultSelectMenuStyles: {
  [K in SelectMenuControls]: CssLikeStyles;
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

export const defaultSelectItemStyles: {
  [K in SelectItemControls]: CssLikeStyles;
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
