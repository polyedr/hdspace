export interface StyleConfig {
  label: string;
  style: string;
  className?: string;
}

export type StyleConfigList = StyleConfig[];

export const INLINE_STYLE_BUTTONS: StyleConfigList = [
  { label: 'Bold', style: 'BOLD' },
  { label: 'Italic', style: 'ITALIC' },
  { label: 'Underline', style: 'UNDERLINE' },
];

const EditorToolbarConfig: any = {
  display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS'],
  INLINE_STYLE_BUTTONS,
};

export default EditorToolbarConfig;
