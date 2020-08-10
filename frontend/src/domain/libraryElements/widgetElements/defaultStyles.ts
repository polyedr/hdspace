import {
  DEFAULT_SIZE,
  DEFAULT_INDENTS,
  DEFAULT_BORDER,
  DEFAULT_BACKGROUND,
  DEFAULT_TYPOGRAPHY,
} from '$domain/constants/defaultStyles';
import {
  mapStyleControls,
  calendarStyleControls,
  clockStyleControls,
} from '$domain/core';
import { CssLikeStyles } from '$utils/StyleHelper';

type MapControls = typeof mapStyleControls[number];
type CalendarControls = typeof calendarStyleControls[number];
type ClockControls = typeof clockStyleControls[number];

export const defaultMapStyles: { [K in MapControls]: CssLikeStyles } & {
  other?: CssLikeStyles;
} = {
  indents: {
    ...DEFAULT_INDENTS,
  },
  size: {
    ...DEFAULT_SIZE,
    width: '500px',
    height: '300px',
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

export const defaultCalendarStyles: {
  [K in CalendarControls]: CssLikeStyles;
} & { other?: CssLikeStyles } = {
  indents: {
    ...DEFAULT_INDENTS,
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

export const defaultClockStyles: { [K in ClockControls]: CssLikeStyles } & {
  other?: CssLikeStyles;
} = {
  indents: {
    ...DEFAULT_INDENTS,
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
