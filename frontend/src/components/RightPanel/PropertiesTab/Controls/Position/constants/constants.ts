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
  { label: 'none', value: 'unset' },
  { label: 'top left', value: '0% 100% 0% 0%' },
  { label: 'top center', value: '0% 50% 0% 50%' },
  { label: 'top right', value: '0% 0% 0% 100%' },
  { label: 'center left', value: '50% 100% 50% 0%' },
  { label: 'center center', value: '50% 50% 50% 50%' },
  { label: 'center right', value: '50% 0% 50% 100%' },
  { label: 'bottom left', value: '100% 100% 0% 0%' },
  { label: 'bottom center', value: '100% 50% 0% 50%' },
  { label: 'bottom right', value: '100% 0% 0% 100%' },
];

export const particularPositionStyles = {
  // inset: 'top right bottom left'
  unset: { inset: 'unset' },
  topLeft: { inset: '0% 100% 0% 0%' },
  topCenter: { inset: '0% 50% 0% 50%' },
  topRight: { inset: '0% 0% 0% 100%' },
  centerLeft: { inset: '50% 100% 50% 0%' },
  centerCenter: { inset: '50% 50% 50% 50%' },
  centerRight: { inset: '50% 0% 50% 100%' },
  bottomLeft: { inset: '100% 100% 0% 0%' },
  bottomCenter: { inset: '100% 50% 0% 50%' },
  bottomRight: { inset: '100% 0% 0% 100%' },
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
