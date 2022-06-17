export const positionsList = [
  { label: 'Static', value: 'static' },
  { label: 'Relative', value: 'relative' },
  { label: 'Absolute', value: 'absolute' },
  { label: 'Sticky', value: 'sticky' },
  { label: 'Fixed', value: 'fixed' },
];

export enum POSITIONS {
  STATIC = 'static',
  RELATIVE = 'relative',
  ABSOLUTE = 'absolute',
  STICKY = 'sticky',
  FIXED = 'fixed',
}

export const particularPosition = [
  { label: 'None', value: 'none' },
  { label: 'Top Left', value: 'topLeft' },
  { label: 'Top Center', value: 'topCenter' },
  { label: 'Top Right', value: 'topRight' },
  { label: 'Center Left', value: 'centerLeft' },
  { label: 'Center Center', value: 'centerCenter' },
  { label: 'Center Right', value: 'centerRight' },
  { label: 'Bottom Left', value: 'bottomLeft' },
  { label: 'Bottom Center', value: 'bottomCenter' },
  { label: 'Bottom Right', value: 'bottomRight' },
];

export const particularPositionStyles = {
  topLeft: { left: '0%', top: '0%' },
  topCenter: { left: '50%', top: '0%' },
  topRight: { right: '0%', top: '0%' },
  centerLeft: { left: '0%', top: '50%' },
  centerCenter: { left: '50%', top: '50%' },
  centerRight: { right: '0%', top: '50%' },
  bottomLeft: { left: '0%', bottom: '0%' },
  bottomCenter: { left: '50%', bottom: '0%' },
  bottomRight: { right: '0%', bottom: '0%' },
};

export enum PARTICULAR_POSITION {
  TOP_LEFT = 'topLeft',
  TOP_CENTER = 'topCenter',
  TOP_RIGHT = 'topRight',
  MIDDLE_LEFT = 'centerLeft',
  MIDDLE_CENTER = 'centerCenter',
  MIDDLE_RIGHT = 'centerRight',
  BOTTOM_LEFT = 'bottomLeft',
  BOTTOM_CENTER = 'bottomCenter',
  BOTTOM_RIGHT = 'bottomRight',
}
