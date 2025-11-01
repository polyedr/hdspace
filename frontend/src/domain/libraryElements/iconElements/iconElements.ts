import { DEFAULT_LAYOUT_LIST } from '@Constants/defaultParams';
import { defaultFreeCanvasParams } from '@Domain/core';
import { ElementGroup, IconServerElement } from '@Src/types';

export const makeIcon = (
  name: string = 'master',
  id: string = 'master',
): IconServerElement => ({
  id,
  buoyancy: 0,
  func_type: 'icon',
  struct_type: 'icon',
  parameters: {
    layouts: DEFAULT_LAYOUT_LIST,
    freeCanvas: {
      ...defaultFreeCanvasParams,
      width: 80,
      height: 80,
    },
    group: ElementGroup.ICON,
    size: 20,
    name,
    iconColor: '#000',
  },
  styles: {
    classNames: ['icon'],
    ownStyles: {},
    pseudoClassStyles: {},
  },
  name: 'icon',
  children: [],
});
