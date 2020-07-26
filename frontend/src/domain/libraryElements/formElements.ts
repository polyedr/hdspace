import {
  ButtonServerElement,
  TextinputServerElement,
  CheckboxServerElement,
  RadiobuttonServerElement,
  SelectItemServerElement,
  SelectMenuServerElement,
  SelectServerElement,
  LabelServerElement,
  TextareaServerElement,
} from '$api/types';
import { getDefaultStyles } from '$domain/defaultStyles/defaultStyles';
import {
  defaultButtonParams,
  defaultTextinputParams,
  defaultCheckboxParams,
  defaultRadiobuttonParams,
  defaultSelectParams,
  defaultLabelParams,
  defaultTextareaParams,
} from '$domain/defaultParams/defaultParams';

export const button: ButtonServerElement = {
  buoyancy: 1,
  func_type: 'button',
  struct_type: 'button',
  parameters: {
    group: 'form',
    ...defaultButtonParams,
  },
  styles: {
    classNames: ['button'],
    idStyles: {},
  },
  name: 'button',
  children: [],
};

export const textinput:TextinputServerElement = {
  buoyancy: 0,
  func_type: 'textinput',
  struct_type: 'textinput',
  parameters: {
    group: 'form',
    ...defaultTextinputParams,
  },
  styles: {
    classNames: [],
    idStyles: {},
  },
  name: 'textinput',
  children: [],
};

export const checkbox: CheckboxServerElement = {
  buoyancy: 0,
  func_type: 'checkbox',
  struct_type: 'checkbox',
  parameters: {
    group: 'form',
    ...defaultCheckboxParams,
  },
  styles: {
    classNames: ['checkbox'],
    idStyles: {},
  },
  name: 'checkbox',
  children: [],
};

export const radiobutton: RadiobuttonServerElement = {
  buoyancy: 0,
  func_type: 'radiobutton',
  struct_type: 'radiobutton',
  parameters: {
    group: 'form',
    ...defaultRadiobuttonParams,
  },
  styles: {
    classNames: ['radiobutton'],
    idStyles: {},
  },
  name: 'radiobutton',
  children: [],
};

export const makeSelectItem = (name: string, value: string): SelectItemServerElement => ({
  buoyancy: 0,
  func_type: 'selectItem',
  struct_type: 'selectItem',
  parameters: {
    name,
    value,
  },
  styles: {
    classNames: ['selectItem'],
    idStyles: {},
  },
  name: 'selectItem',
  children: [],
});

export const selectMenu: SelectMenuServerElement = {
  buoyancy: 0,
  func_type: 'selectMenu',
  struct_type: 'selectMenu',
  parameters: {},
  styles: {
    classNames: ['selectMenu'],
    idStyles: {},
  },
  name: 'selectMenu',
  children: [
    makeSelectItem('First option', 'first option'),
    makeSelectItem('Second option', 'second option'),
    makeSelectItem('Third option', 'third option'),
  ],
};

export const select: SelectServerElement = {
  buoyancy: 0,
  func_type: 'select',
  struct_type: 'select',
  parameters: {
    group: 'form',
    ...defaultSelectParams,
  },
  styles: {
    classNames: ['select'],
    idStyles: {},
  },
  name: 'select',
  children: [selectMenu],
};

export const label: LabelServerElement = {
  buoyancy: 0,
  func_type: 'label',
  struct_type: 'label',
  parameters: {
    group: 'typography',
    ...defaultLabelParams,
  },
  styles: {
    classNames: ['label'],
    idStyles: {},
  },
  name: 'label',
  children: [],
};

export const textarea: TextareaServerElement = {
  buoyancy: 0,
  func_type: 'textarea',
  struct_type: 'textarea',
  parameters: {
    group: 'form',
    ...defaultTextareaParams,
  },
  styles: {
    classNames: ['textarea'],
    idStyles: {},
  },
  name: 'textarea',
  children: [],
};
