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
  RadiobuttonGroupServerElement,
  SwitchServerElement,
  SliderServerElement,
  DateTimePickerServerElement,
  DateTimePickerType,
} from '@Src/types';
import { DEFAULT_LAYOUT_LIST } from '@Constants/defaultParams';
import { v4 } from 'uuid';

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
    pseudoClassStyles: {},
  },
  name: 'Generated background button',
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
    pseudoClassStyles: {},
  },
  name: 'textinput',
  children: [],
});

export const makeCheckbox = (): CheckboxServerElement => ({
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
    value: 'Checkbox',
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
    pseudoClassStyles: {},
  },
  name: 'checkbox',
  children: [],
});

export const makeSwitch = (): SwitchServerElement => ({
  id: 'switch',
  buoyancy: 0,
  func_type: 'switch',
  struct_type: 'switch',
  parameters: {
    layouts: DEFAULT_LAYOUT_LIST,
    freeCanvas: {
      ...defaultFreeCanvasParams,
      width: 24,
      height: 24,
    },
    group: ElementGroup.FORM,
    value: 'Switch',
    defaultChecked: true,
    name: '',
  },
  styles: {
    classNames: ['switch'],
    ownStyles: {
      display: 'block',
      width: 24,
      height: 24,
    },
    pseudoClassStyles: {},
  },
  name: 'switch',
  children: [],
});

export const makeRadiobutton = (
  value: string = 'radio',
  label: string = 'Radio',
  name: string = v4(),
): RadiobuttonServerElement => ({
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
    value,
    label,
    name,
    showRipple: true,
  },
  styles: {
    classNames: ['radiobutton'],
    ownStyles: {
      display: 'block',
    },
    pseudoClassStyles: {},
  },
  name: 'radiobutton',
  children: [],
});

export const makeRadiobuttonGroup = (): RadiobuttonGroupServerElement => {
  const randomName = v4();
  return {
    id: 'radiobuttonGroup',
    buoyancy: 0,
    func_type: 'radiobuttonGroup',
    struct_type: 'radiobuttonGroup',
    parameters: {
      layouts: DEFAULT_LAYOUT_LIST,
      freeCanvas: defaultFreeCanvasParams,
      group: ElementGroup.FORM,
      value: 'first radio',
    },
    styles: {
      classNames: ['radiobuttonGroup'],
      ownStyles: {},
      pseudoClassStyles: {},
    },
    name: 'radiobuttonGroup',
    children: [
      makeRadiobutton('first radio', 'First', randomName),
      makeRadiobutton('second radio', 'Second', randomName),
    ],
  };
};

export const makeOption = (
  name: string = '',
  value: string = '',
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
    pseudoClassStyles: {},
  },
  name: 'option',
  children: [],
});

export const makeSelect = (): SelectServerElement => ({
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
    pseudoClassStyles: {},
  },
  name: 'select',
  children: [
    makeOption('First option', 'first option'),
    makeOption('Second option', 'second option'),
    makeOption('Third option', 'third option'),
  ],
});

export const makeLabel = ({
  textContent = 'This is a label',
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
    pseudoClassStyles: {},
  },
  name: 'label',
  children: [],
});

export const makeTextarea = (): TextareaServerElement => ({
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
    pseudoClassStyles: {},
  },
  name: 'textarea',
  children: [],
});

export const makeSlider = (): SliderServerElement => ({
  id: 'slider',
  buoyancy: 0,
  func_type: 'slider',
  struct_type: 'slider',
  parameters: {
    layouts: DEFAULT_LAYOUT_LIST,
    freeCanvas: {
      ...defaultFreeCanvasParams,
      width: 170,
      height: 90,
    },
    group: ElementGroup.FORM,
    min: 0,
    value: 70,
    max: 100,
    step: 1,
  },
  styles: {
    classNames: ['slider'],
    ownStyles: {},
    pseudoClassStyles: {},
  },
  name: 'slider',
  children: [],
  custom: true,
});

export const makeDateTimePicker = (): DateTimePickerServerElement => ({
  id: 'dateTimePicker',
  buoyancy: 0,
  func_type: 'dateTimePicker',
  struct_type: 'dateTimePicker',
  parameters: {
    layouts: DEFAULT_LAYOUT_LIST,
    freeCanvas: {
      ...defaultFreeCanvasParams,
      width: 300,
      height: 300,
    },
    label: 'Date & Time Picker',
    type: DateTimePickerType.DateTime,
    group: ElementGroup.FORM,
  },
  styles: {
    classNames: ['dateTimePicker'],
    ownStyles: {},
    pseudoClassStyles: {},
  },
  name: 'dateTimePicker',
  children: [],
});
