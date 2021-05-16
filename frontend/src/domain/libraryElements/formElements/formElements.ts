import { defaultFreeCanvasParams } from '@Domain/core';
import {
  ButtonServerElement,
  CheckboxServerElement,
  ElementGroup,
  LabelServerElement,
  RadiobuttonServerElement,
  OptionServerElement,
  SelectServerElement,
  TextareaServerElement,
  TextinputServerElement,
} from '@Src/types';
import { DEFAULT_LAYOUT_LIST } from '@Constants/defaultParams';

export const makeButton = ({
  buoyancy = 0,
  textContent = 'button',
  ownStyles = {},
}: {
  buoyancy?: number;
  textContent?: string;
  ownStyles?: React.CSSProperties;
} = {}): ButtonServerElement => ({
  id: 'button',
  buoyancy,
  func_type: 'button',
  struct_type: 'button',
  parameters: {
    layouts: DEFAULT_LAYOUT_LIST,
    freeCanvas: {
      ...defaultFreeCanvasParams,
      width: 54,
      height: 27,
    },
    group: ElementGroup.FORM,
    textContent,
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
  id: 'textinput',
  buoyancy: 0,
  func_type: 'textinput',
  struct_type: 'textinput',
  parameters: {
    layouts: DEFAULT_LAYOUT_LIST,
    freeCanvas: {
      ...defaultFreeCanvasParams,
      height: 27,
      width: 160,
    },
    group: ElementGroup.FORM,
    textContent: '',
    type: 'text',
    placeholder: 'Placeholder',
  },
  styles: {
    classNames: ['textinput'],
    ownStyles,
  },
  name: 'textinput',
  children: [],
});

export const checkbox: CheckboxServerElement = {
  id: 'checkbox',
  buoyancy: 0,
  func_type: 'checkbox',
  struct_type: 'checkbox',
  parameters: {
    layouts: DEFAULT_LAYOUT_LIST,
    freeCanvas: {
      ...defaultFreeCanvasParams,
      width: 24,
      height: 24,
    },
    group: ElementGroup.FORM,
    value: '',
    defaultChecked: true,
    name: '',
    showRipple: true,
  },
  styles: {
    classNames: ['checkbox'],
    ownStyles: {
      display: 'block',
      width: 24,
      height: 24,
    },
  },
  name: 'checkbox',
  children: [],
};

export const radiobutton: RadiobuttonServerElement = {
  id: 'radiobutton',
  buoyancy: 0,
  func_type: 'radiobutton',
  struct_type: 'radiobutton',
  parameters: {
    layouts: DEFAULT_LAYOUT_LIST,
    freeCanvas: {
      ...defaultFreeCanvasParams,
      width: 24,
      height: 24,
    },
    group: ElementGroup.FORM,
    value: '',
    name: '',
    showRipple: true,
  },
  styles: {
    classNames: ['radiobutton'],
    ownStyles: {
      display: 'block',
      width: '24px',
      height: '24px',
    },
  },
  name: 'radiobutton',
  children: [],
};

export const makeOption = (
  name: string,
  value: string,
): OptionServerElement => ({
  id: 'option',
  buoyancy: 0,
  func_type: 'option',
  struct_type: 'option',
  parameters: {
    layouts: DEFAULT_LAYOUT_LIST,
    freeCanvas: defaultFreeCanvasParams,
    name,
    value,
    group: ElementGroup.OTHER,
  },
  styles: {
    classNames: ['option'],
    ownStyles: {},
  },
  name: 'option',
  children: [],
});

export const select: SelectServerElement = {
  id: 'select',
  buoyancy: 0,
  func_type: 'select',
  struct_type: 'select',
  parameters: {
    layouts: DEFAULT_LAYOUT_LIST,
    freeCanvas: {
      ...defaultFreeCanvasParams,
      width: 200,
      height: 24,
    },
    group: ElementGroup.FORM,
    value: 'first option',
    isOpen: false,
  },
  styles: {
    classNames: ['select'],
    ownStyles: {},
  },
  name: 'select',
  children: [
    makeOption('First option', 'first option'),
    makeOption('Second option', 'second option'),
    makeOption('Third option', 'third option'),
  ],
};

export const makeLabel = ({
  textContent = 'This is label',
  ownStyles = {},
  UID = 'master',
} = {}): LabelServerElement => ({
  id: `label-${UID}`,
  buoyancy: 0,
  func_type: 'label',
  struct_type: 'label',
  parameters: {
    layouts: DEFAULT_LAYOUT_LIST,
    freeCanvas: {
      ...defaultFreeCanvasParams,
      width: 74,
      height: 21,
    },
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
  id: 'textarea',
  buoyancy: 0,
  func_type: 'textarea',
  struct_type: 'textarea',
  parameters: {
    layouts: DEFAULT_LAYOUT_LIST,
    freeCanvas: {
      ...defaultFreeCanvasParams,
      width: 170,
      height: 90,
    },
    group: ElementGroup.FORM,
    textContent: '',
    placeholder: 'Placeholder',
  },
  styles: {
    classNames: ['textarea'],
    ownStyles: {},
  },
  name: 'textarea',
  children: [],
};
