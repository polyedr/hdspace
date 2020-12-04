import { defaultFreeCanvasParams } from '../../core';
import {
  ButtonServerElement,
  CheckboxServerElement,
  ElementGroup,
  LabelServerElement,
  RadiobuttonServerElement,
  SelectItemServerElement,
  SelectMenuServerElement,
  SelectServerElement,
  TextareaServerElement,
  TextinputServerElement,
} from '../../../types';

export const makeButton = ({
  buoyancy = 0,
  textContent = 'button',
  ownStyles = {},
}: {
  buoyancy?: number;
  textContent?: string;
  ownStyles?: React.CSSProperties;
} = {}): ButtonServerElement => ({
  buoyancy,
  func_type: 'button',
  struct_type: 'button',
  parameters: {
    ...defaultFreeCanvasParams,
    group: ElementGroup.FORM,
    textContent,
    action: {
      type: 'internal-link',
      screenId: 'noScreen',
    },
    showRipple: true,
  },
  styles: {
    classNames: ['button'],
    ownStyles,
  },
  name: 'button',
  children: [],
});

export const makeTextinput = ({
  ownStyles = {},
}: {
  ownStyles?: React.CSSProperties;
} = {}): TextinputServerElement => ({
  buoyancy: 0,
  func_type: 'textinput',
  struct_type: 'textinput',
  parameters: {
    ...defaultFreeCanvasParams,
    group: ElementGroup.FORM,
    textContent: '',
    type: 'text',
    placeholder: 'Enter a label for the field',
  },
  styles: {
    classNames: ['textinput'],
    ownStyles,
  },
  name: 'textinput',
  children: [],
});

export const checkbox: CheckboxServerElement = {
  buoyancy: 0,
  func_type: 'checkbox',
  struct_type: 'checkbox',
  parameters: {
    ...defaultFreeCanvasParams,
    group: ElementGroup.FORM,
    value: '',
    defaultChecked: true,
    name: '',
    showRipple: true,
  },
  styles: {
    classNames: ['checkbox'],
    ownStyles: {},
  },
  name: 'checkbox',
  children: [],
};

export const radiobutton: RadiobuttonServerElement = {
  buoyancy: 0,
  func_type: 'radiobutton',
  struct_type: 'radiobutton',
  parameters: {
    ...defaultFreeCanvasParams,
    group: ElementGroup.FORM,
    value: '',
    name: '',
    showRipple: true,
  },
  styles: {
    classNames: ['radiobutton'],
    ownStyles: {},
  },
  name: 'radiobutton',
  children: [],
};

export const makeSelectItem = (
  name: string,
  value: string,
): SelectItemServerElement => ({
  buoyancy: 0,
  func_type: 'selectItem',
  struct_type: 'selectItem',
  parameters: {
    ...defaultFreeCanvasParams,
    name,
    value,
  },
  styles: {
    classNames: ['selectItem'],
    ownStyles: {},
  },
  name: 'selectItem',
  children: [],
});

export const selectMenu: SelectMenuServerElement = {
  buoyancy: 0,
  func_type: 'selectMenu',
  struct_type: 'selectMenu',
  parameters: {
    ...defaultFreeCanvasParams,
  },
  styles: {
    classNames: ['selectMenu'],
    ownStyles: {},
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
    ...defaultFreeCanvasParams,
    group: ElementGroup.FORM,
    value: 'first option',
    options: [
      // TODO research why we need options here
      { name: 'First option', value: 'first option' },
      { name: 'Second option', value: 'second option' },
      { name: 'Third option', value: 'third option' },
    ],
    isOpen: false,
  },
  styles: {
    classNames: ['select'],
    ownStyles: {},
  },
  name: 'select',
  children: [selectMenu],
};

export const makeLabel = ({
  textContent = 'This is label',
  ownStyles = {},
}: {
  textContent?: string;
  ownStyles?: React.CSSProperties;
} = {}): LabelServerElement => ({
  buoyancy: 0,
  func_type: 'label',
  struct_type: 'label',
  parameters: {
    ...defaultFreeCanvasParams,
    group: ElementGroup.TYPOGRAPHY,
    textContent,
    labelFor: 'no for attribute',
  },
  styles: {
    classNames: ['label'],
    ownStyles,
  },
  name: 'label',
  children: [],
});

export const textarea: TextareaServerElement = {
  buoyancy: 0,
  func_type: 'textarea',
  struct_type: 'textarea',
  parameters: {
    ...defaultFreeCanvasParams,
    group: ElementGroup.FORM,
    textContent: '',
    placeholder: 'Enter a label for the field',
  },
  styles: {
    classNames: ['textarea'],
    ownStyles: {},
  },
  name: 'textarea',
  children: [],
};
