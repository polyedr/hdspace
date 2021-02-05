import {
  CalendarServerElement,
  ClockServerElement,
  ElementGroup,
  MapServerElement,
} from '@Src/types';
import { DEFAULT_LAYOUT_LIST } from '@Constants/defaultParams';
import { defaultFreeCanvasParams } from '../../core';

export const map: MapServerElement = {
  buoyancy: 0,
  func_type: 'map',
  struct_type: 'map',
  parameters: {
    layouts: DEFAULT_LAYOUT_LIST,
    freeCanvas: {
      ...defaultFreeCanvasParams,
      width: '50%',
      height: '50%',
    },
    group: ElementGroup.WIDGET,
    map_props: {
      center: {
        lat: 50.00008,
        lng: 40.00008,
      },
      zoom: 10,
      markerText: 'A',
      apiKey: '',
    },
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
    layouts: DEFAULT_LAYOUT_LIST,
    freeCanvas: defaultFreeCanvasParams,
    group: ElementGroup.WIDGET,
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
    layouts: DEFAULT_LAYOUT_LIST,
    freeCanvas: defaultFreeCanvasParams,
    group: ElementGroup.WIDGET,
  },
  styles: {
    classNames: ['clock'],
    ownStyles: {},
  },
  name: 'clock',
  children: [],
};
