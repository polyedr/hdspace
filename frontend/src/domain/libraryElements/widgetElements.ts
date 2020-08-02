import { MapServerElement, CalendarServerElement, ClockServerElement } from "$api/types";
import { getDefaultStyles } from "$domain/defaultStyles/defaultStyles";
import { defaultMapParams } from "$domain/defaultParams/defaultParams";

export const map: MapServerElement = {
  buoyancy: 0,
  func_type: 'map',
  struct_type: 'map',
  parameters: {
    group: 'widget',
    ...defaultMapParams,
  },
  styles: {
    classNames: ['map'],
    ownStyles: {},
  },
  name: 'map',
  children: [],
};

export const calendar: CalendarServerElement = {
  buoyancy: 0,
  func_type: 'calendar',
  struct_type: 'calendar',
  parameters: {
    group: 'widget',
  },
  styles: {
    classNames: ['calendar'],
    ownStyles: {},
  },
  name: 'calendar',
  children: [],
};

export const clock: ClockServerElement = {
  buoyancy: 0,
  func_type: 'clock',
  struct_type: 'clock',
  parameters: {
    group: 'widget',
  },
  styles: {
    classNames: ['clock'],
    ownStyles: {},
  },
  name: 'clock',
  children: [],
};
