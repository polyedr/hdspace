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
import { CssLikeStyles } from '$utils/StyleHelper';

export const button: ButtonServerElement = {
  buoyancy: 1,
  func_type: 'button',
  struct_type: 'button',
  parameters: {
    group: 'form',
    textContent: 'button',
    action: {
      type: 'internal-link',
      screenID: 'noScreen',
    },
    showRipple: true,
  },
  styles: {
    classNames: ['button'],
    ownStyles: {} as Required<CssLikeStyles>,
  },
  name: 'button',
  children: [],
};

export const textinput: TextinputServerElement = {
  buoyancy: 0,
  func_type: 'textinput',
  struct_type: 'textinput',
  parameters: {
    group: 'form',
    textContent: '',
    type: 'text',
    placeholder: 'Enter a label for the field',
  },
  styles: {
    classNames: ['textinput'],
    ownStyles: {} as Required<CssLikeStyles>,
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
    value: '',
    defaultChecked: true,
    name: '',
    showRipple: true,
  },
  styles: {
    classNames: ['checkbox'],
    ownStyles: {} as Required<CssLikeStyles>,
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
    value: '',
    name: '',
    showRipple: true,
  },
  styles: {
    classNames: ['radiobutton'],
    ownStyles: {} as Required<CssLikeStyles>,
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
    ownStyles: {} as Required<CssLikeStyles>,
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
    ownStyles: {} as Required<CssLikeStyles>,
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
    value: 'first option',
    options: [ // TODO research why we need options here
      { name: 'First option', value: 'first option' },
      { name: 'Second option', value: 'second option' },
      { name: 'Third option', value: 'third option' },
    ],
    isOpen: false,
  },
  styles: {
    classNames: ['select'],
    ownStyles: {} as Required<CssLikeStyles>,
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
    textContent: 'This is label',
    labelFor: 'no for attribute',
  },
  styles: {
    classNames: ['label'],
    ownStyles: {} as Required<CssLikeStyles>,
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
    textContent: '',
    placeholder: 'Enter a label for the field',
  },
  styles: {
    classNames: ['textarea'],
    ownStyles: {} as Required<CssLikeStyles>,
  },
  name: 'textarea',
  children: [],
};
