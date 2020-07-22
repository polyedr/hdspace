import { Entity } from '$domain/core';
import { ButtonParameters, TextinputParameters, CheckboxParameters, RadiobuttonParameters, LabelParameters, HyperLinkParameters, HeadingParameters, ParagraphParameters, TextBlockParameters, ListParameters, ListItemParameters, ImageParameters, SelectParameters, SelectItemParameters, MapParameters, DropdownParameters, DropdownItemParameters, VideoParameters, TextareaParameters } from '$api/types';
import {
  DEFAULT_ACTION,
  DEFAULT_RIPPLE,
  DEFAULT_INPUT_TYPE,
  DEFAULT_PLACEHOLDER,
  DEFAULT_NAME,
  DEFAULT_LABEL_FOR,
  DEFAULT_HEADING_TYPE,
  DEFAULT_LIST_ITEMS,
  DEFAULT_LIST_TYPE,
  DEFAULT_IMAGE_PROPS,
  DEFAULT_SELECT_VALUE,
  DEFAULT_SELECT_OPTIONS,
  DEFAULT_SELECT_OPEN,
  DEFAULT_MAP_PROPS,
  DEFAULT_DROPDOWN_ITEMS,
  DEFAULT_VIDEO_SETTINGS,
} from '$constants/defaultParams';

export const defaultButtonParams: ButtonParameters = {
  textContent: 'button',
  ...DEFAULT_ACTION,
  ...DEFAULT_RIPPLE,
};

export const defaultTextinputParams: TextinputParameters = {
  textContent: '',
  ...DEFAULT_INPUT_TYPE,
  ...DEFAULT_PLACEHOLDER,
};

export const defaultTextareaParams: TextareaParameters = {
  textContent: '',
  ...DEFAULT_PLACEHOLDER,
};

export const defaultCheckboxParams: CheckboxParameters = {
  value: '',
  defaultChecked: true,
  ...DEFAULT_NAME,
  ...DEFAULT_RIPPLE,
};

export const defaultRadiobuttonParams: RadiobuttonParameters = {
  value: '',
  ...DEFAULT_NAME,
  ...DEFAULT_RIPPLE,
};

export const defaultLabelParams: LabelParameters = {
  textContent: 'This is label',
  ...DEFAULT_LABEL_FOR,
};

export const defaultHyperlinkParams: HyperLinkParameters = {
  textContent: 'hyperlink',
  ...DEFAULT_ACTION,
};

export const defaultHeadingParams: HeadingParameters = {
  textContent: 'Heading',
  ...DEFAULT_HEADING_TYPE,
};

export const defaultParagraphParams: ParagraphParameters = {
  textContent: 'This is paragraph',
};

export const defaultTextBlockParams: TextBlockParameters = {
  textContent: 'This is text block',
};

export const defaultListParams: ListParameters = {
  ...DEFAULT_LIST_ITEMS,
  ...DEFAULT_LIST_TYPE,
};

export const defaultListItemParams: ListItemParameters = {
  textContent: 'New item',
  isLink: false,
  link: '',
};

export const defaultImageParams: ImageParameters = {
  ...DEFAULT_IMAGE_PROPS,
};

export const defaultSelectParams: SelectParameters = {
  ...DEFAULT_SELECT_VALUE,
  ...DEFAULT_SELECT_OPTIONS,
  ...DEFAULT_SELECT_OPEN,
};

export const defaultSelectItemParams: SelectItemParameters= {
  name: 'New option',
  value: 'New option',
};

export const defaultMapParams: MapParameters = {
  ...DEFAULT_MAP_PROPS,
};

export const defaultDropdownParams: DropdownParameters = {
  textContent: 'dropdown',
  ...DEFAULT_RIPPLE,
  ...DEFAULT_SELECT_OPEN,
  ...DEFAULT_DROPDOWN_ITEMS,
};

export const defaultDropdownItemParams: DropdownItemParameters = {
  textContent: 'New item',
};

export const defaultVideoParams: VideoParameters = {
  ...DEFAULT_VIDEO_SETTINGS,
};

const DEFAULT_ELEMENTS_PARAMS: { [K in Entity]: { [key: string]: any } } = {
  root: {},
  container: {},
  divBlock: {},
  button: defaultButtonParams,
  textinput: defaultTextinputParams,
  textarea: defaultTextareaParams,
  checkbox: defaultCheckboxParams,
  radiobutton: defaultRadiobuttonParams,
  label: defaultLabelParams,
  hyperlink: defaultHyperlinkParams,
  heading: defaultHeadingParams,
  paragraph: defaultParagraphParams,
  ocrtext: defaultParagraphParams,
  text_block: defaultTextBlockParams,
  list: defaultListParams,
  listItem: defaultListItemParams,
  image: defaultImageParams,
  select: defaultSelectParams,
  selectMenu: {},
  selectItem: defaultSelectItemParams,
  map: defaultMapParams,
  calendar: {},
  clock: {},
  dropdown: defaultDropdownParams,
  dropdownMenu: {},
  dropdownItem: defaultDropdownItemParams,
  video: defaultVideoParams,
  undefined: {},
};

export const getDefaultParams = (elementType: Entity) => {
  return Object.values(DEFAULT_ELEMENTS_PARAMS[elementType]).reduce(
    (acc, params) => ({ ...acc, ...params }),
    {}
  );
};
