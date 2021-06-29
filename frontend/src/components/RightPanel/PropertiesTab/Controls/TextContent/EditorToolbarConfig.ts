import { ReactNode } from 'react';

export type StyleConfig = {
  label: string;
  style: string;
  className?: string;
};

export type CustomControl = ReactNode;
export type CustomControlList = Array<CustomControl>;

export type StyleConfigList = Array<StyleConfig>;

export type GroupName = 'INLINE_STYLE_BUTTONS' | 'BLOCK_TYPE_BUTTONS';

export type ToolbarConfig = {
  display: Array<GroupName>;
  extraProps?: Object;
  INLINE_STYLE_BUTTONS: StyleConfigList;
  BLOCK_TYPE_BUTTONS: StyleConfigList;
};

export const INLINE_STYLE_BUTTONS: StyleConfigList = [
  { label: 'Bold', style: 'BOLD' },
  { label: 'Italic', style: 'ITALIC' },
  { label: 'Underline', style: 'UNDERLINE' },
];

// export const BLOCK_ALIGNMENT_BUTTONS: StyleConfigList = [
//   { label: 'Align Left', style: 'ALIGN_LEFT' },
//   { label: 'Align Center', style: 'ALIGN_CENTER' },
//   { label: 'Align Right', style: 'ALIGN_RIGHT' },
//   { label: 'Align Justify', style: 'ALIGN_JUSTIFY' },
// ];

export const BLOCK_TYPE_BUTTONS: StyleConfigList = [
  { label: 'UL', style: 'unordered-list-item' },
  { label: 'OL', style: 'ordered-list-item' },
];

const EditorToolbarConfig: ToolbarConfig = {
  display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS'],
  INLINE_STYLE_BUTTONS,
  BLOCK_TYPE_BUTTONS,
};

export default EditorToolbarConfig;
