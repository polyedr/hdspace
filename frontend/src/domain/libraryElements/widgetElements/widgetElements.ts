import { defaultFreeCanvasParams } from '../../core';
import {
  CalendarServerElement,
  ClockServerElement,
  CssLikeStyles,
  MapServerElement,
} from '../../../types';

export const map: MapServerElement = {
  buoyancy: 0,
  func_type: 'map',
  struct_type: 'map',
  parameters: {
    ...defaultFreeCanvasParams,
    width: '50%',
    height: '50%',
    group: 'widget',
    map_props: {
      center: {
        lat: 50.00008,
        lng: 40.00008,
      },
      zoom: 10,
      markerText: 'A',
    },
  },
  styles: {
    classNames: ['map'],
    ownStyles: {} as Required<CssLikeStyles>,
  },
  name: 'map',
  children: [],
};

export const calendar: CalendarServerElement = {
  buoyancy: 0,
  func_type: 'calendar',
  struct_type: 'calendar',
  parameters: {
    ...defaultFreeCanvasParams,
    group: 'widget',
  },
  styles: {
    classNames: ['calendar'],
    ownStyles: {} as Required<CssLikeStyles>,
  },
  name: 'calendar',
  children: [],
};

export const clock: ClockServerElement = {
  buoyancy: 0,
  func_type: 'clock',
  struct_type: 'clock',
  parameters: {
    ...defaultFreeCanvasParams,
    group: 'widget',
  },
  styles: {
    classNames: ['clock'],
    ownStyles: {} as Required<CssLikeStyles>,
  },
  name: 'clock',
  children: [],
};
