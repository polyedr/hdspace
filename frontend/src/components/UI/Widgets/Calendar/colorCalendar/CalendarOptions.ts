export interface CalendarOptions {
  id?: string;
  calendarSize?: string;
  layoutModifiers?: LayoutModifier[];
  theme?: string;
  primaryColor?: string;
  headerColor?: string;
  headerBackgroundColor?: string;
  weekdaysColor?: string;
  weekdayDisplayType?: WeekdayDisplayType;
  monthDisplayType?: MonthDisplayType;
  startWeekday?: StartWeekday;
  fontFamilyHeader?: string;
  fontFamilyWeekdays?: string;
  fontFamilyBody?: string;
  dropShadow?: string;
  border?: string;
  borderRadius?: string;
  disableMonthYearPickers?: boolean;
  disableDayClick?: boolean;
  disableMonthArrowClick?: boolean;
  monthChanged?: (currentDate?: Date) => void;
  dateChanged?: (currentDate?: Date) => void;
  document?: Document | null;
}

export interface Day {
  day: number;
  selected?: boolean;
}

export type CalendarSize = string; // | 'small' | 'large';

export type LayoutModifier = 'month-left-align';

export type MonthDisplayType = 'short' | 'long';

export type WeekdayDisplayType = 'short' | 'long-lower' | 'long-upper';

export type Weekdays = [string, string, string, string, string, string, string];

export type StartWeekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;
