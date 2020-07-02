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

export const button: Omit<ButtonServerElement, 'parameters'> & { parameters: { group: string } } = {
  buoyancy: 1,
  func_type: 'button',
  struct_type: 'button',
  parameters: {
    group: 'form',
  },
  styles: {},
  name: 'button',
  children: [],
};

export const textinput: Omit<TextinputServerElement, 'parameters'> & { parameters: { group: string } } = {
  buoyancy: 0,
  func_type: 'textinput',
  struct_type: 'textinput',
  parameters: {
    group: 'form',
  },
  styles: {},
  name: 'textinput',
  children: [],
};

export const checkbox: Omit<CheckboxServerElement, 'parameters'> & { parameters: { group: string, defaultChecked: boolean } } = {
  buoyancy: 0,
  func_type: 'checkbox',
  struct_type: 'checkbox',
  parameters: {
    group: 'form',
    defaultChecked: true,
  },
  styles: {},
  name: 'checkbox',
  children: [],
};

export const radiobutton: Omit<RadiobuttonServerElement, 'parameters'> & { parameters: { group: string } } = {
  buoyancy: 0,
  func_type: 'radiobutton',
  struct_type: 'radiobutton',
  parameters: {
    group: 'form',
  },
  styles: {},
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
  styles: {},
  name: 'selectItem',
  children: [],
});

export const selectMenu: Omit<SelectMenuServerElement, 'parameters'> & { parameters: {} } = {
  buoyancy: 0,
  func_type: 'selectMenu',
  struct_type: 'selectMenu',
  parameters: {},
  styles: {},
  name: 'selectMenu',
  children: [
    makeSelectItem('First option', 'first option'),
    makeSelectItem('Second option', 'second option'),
    makeSelectItem('Third option', 'third option'),
  ],
};

export const select: Omit<SelectServerElement, 'parameters'> & { parameters: { group: string } } = {
  buoyancy: 0,
  func_type: 'select',
  struct_type: 'select',
  parameters: {
    group: 'form',
  },
  styles: {},
  name: 'select',
  children: [selectMenu],
};

export const label: Omit<LabelServerElement, 'parameters'> & { parameters: { group: string } } = {
  buoyancy: 0,
  func_type: 'label',
  struct_type: 'label',
  parameters: {
    group: 'typography',
  },
  styles: {},
  name: 'label',
  children: [],
};

export const textarea: Omit<TextareaServerElement, 'parameters'> & { parameters: { group: string } } = {
  buoyancy: 0,
  func_type: 'textarea',
  struct_type: 'textarea',
  parameters: {
    group: 'form',
  },
  styles: {},
  name: 'textarea',
  children: [],
};
