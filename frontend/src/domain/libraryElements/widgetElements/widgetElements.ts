import {
  CalendarServerElement,
  ClockServerElement,
  ElementGroup,
  MapServerElement,
} from '@Src/types';
import { DEFAULT_LAYOUT_LIST } from '@Constants/defaultParams';
import { defaultFreeCanvasParams } from '../../core';

export const makeMap = (): MapServerElement => ({
  id: 'map',
  buoyancy: 0,
  func_type: 'map',
  struct_type: 'map',
  parameters: {
    layouts: DEFAULT_LAYOUT_LIST,
    freeCanvas: {
      ...defaultFreeCanvasParams,
      width: 500,
      height: 300,
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
    pseudoClassStyles: {},
  },
  name: 'map',
  children: [],
});

export const makeCalendar = (): CalendarServerElement => ({
  id: 'calendar',
  buoyancy: 0,
  func_type: 'calendar',
  struct_type: 'calendar',
  parameters: {
    layouts: DEFAULT_LAYOUT_LIST,
    freeCanvas: {
      ...defaultFreeCanvasParams,
      height: 305,
      width: 307,
    },
    group: ElementGroup.WIDGET,
  },
  styles: {
    classNames: ['calendar'],
    ownStyles: {},
    pseudoClassStyles: {},
  },
  name: 'calendar',
  children: [],
});

export const makeClock = (): ClockServerElement => ({
  id: 'clock',
  buoyancy: 0,
  func_type: 'clock',
  struct_type: 'clock',
  parameters: {
    layouts: DEFAULT_LAYOUT_LIST,
    freeCanvas: {
      ...defaultFreeCanvasParams,
      width: 300,
      height: 300,
    },
    group: ElementGroup.WIDGET,
  },
  styles: {
    classNames: ['clock'],
    ownStyles: {},
    pseudoClassStyles: {},
  },
  name: 'clock',
  children: [],
});
