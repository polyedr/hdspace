import { MapServerElement, CalendarServerElement, ClockServerElement } from "$api/types";

export const map: Omit<MapServerElement, 'parameters'> & { parameters: { group: string } } = {
  buoyancy: 0,
  func_type: 'map',
  struct_type: 'map',
  parameters: {
    group: 'widget',
  },
  styles: {},
  name: 'map',
  children: [],
};

export const calendar: Omit<CalendarServerElement, 'parameters'> & { parameters: { group: string } } = {
  buoyancy: 0,
  func_type: 'calendar',
  struct_type: 'calendar',
  parameters: {
    group: 'widget',
  },
  styles: {},
  name: 'calendar',
  children: [],
};

export const clock: Omit<ClockServerElement, 'parameters'> & { parameters: { group: string } } = {
  buoyancy: 0,
  func_type: 'clock',
  struct_type: 'clock',
  parameters: {
    group: 'widget',
  },
  styles: {},
  name: 'clock',
  children: [],
};
