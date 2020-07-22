import {
  RootServerElement,
  ContainerServerElement,
  ImageServerElement,
  DropdownItemServerElement,
  DropdownMenuServerElement,
  DropdownServerElement,
  VideoServerElement,
  UndefinedServerElement,
  DivBlockServerElement,
} from '$api/types';
import { paragraph } from './typographyElements';
import { getDefaultStyles } from '$domain/defaultStyles/defaultStyles';
import { defaultImageParams, defaultDropdownParams, defaultVideoParams } from '$domain/defaultParams/defaultParams';

export const root: RootServerElement = {
  buoyancy: 0,
  func_type: 'root',
  struct_type: 'root',
  parameters: {
    group: 'none',
  },
  styles: {
    classNames: [],
    tagStyles: getDefaultStyles('root'),
    idStyles: {},
    classStyles: {},
  },
  name: 'root',
  children: [],
};

export const container: ContainerServerElement = {
  buoyancy: 0,
  func_type: 'container',
  struct_type: 'container',
  parameters: {
    group: 'none',
  },
  styles: {
    classNames: [],
    tagStyles: getDefaultStyles('container'),
    idStyles: {},
    classStyles: {},
  },
  name: 'container',
  children: [],
};

export const divBlock: DivBlockServerElement = {
  buoyancy: 0,
  func_type: 'divBlock',
  struct_type: 'divBlock',
  parameters: {
    group: 'containers',
  },
  styles: {
    classNames: [],
    tagStyles: getDefaultStyles('divBlock'),
    idStyles: {},
    classStyles: {},
  },
  name: 'divBlock',
  children: [paragraph],
};

export const image: ImageServerElement = {
  buoyancy: 0,
  func_type: 'image',
  struct_type: 'image',
  parameters: {
    group: 'image',
    ...defaultImageParams,
  },
  styles: {
    classNames: [],
    tagStyles: getDefaultStyles('image'),
    idStyles: {},
    classStyles: {},
  },
  name: 'image',
  children: [],
};

export const makeDropdownItem = (textContent: string): DropdownItemServerElement => ({
  buoyancy: 0,
  func_type: 'dropdownItem',
  struct_type: 'dropdownItem',
  parameters: { textContent },
  styles: {
    classNames: [],
    tagStyles: getDefaultStyles('dropdownItem'),
    idStyles: {},
    classStyles: {},
  },
  name: 'dropdownItem',
  children: [],
});

export const dropdownMenu: DropdownMenuServerElement = {
  buoyancy: 0,
  func_type: 'dropdownMenu',
  struct_type: 'dropdownMenu',
  parameters: {},
  styles: {
    classNames: [],
    tagStyles: getDefaultStyles('dropdownMenu'),
    idStyles: {},
    classStyles: {},
  },
  name: 'dropdownMenu',
  children: [
    makeDropdownItem('First option'),
    makeDropdownItem('Second option'),
    makeDropdownItem('Third option'),
  ],
};

export const dropdown: DropdownServerElement = {
  buoyancy: 0,
  func_type: 'dropdown',
  struct_type: 'dropdown',
  parameters: {
    group: 'other',
    ...defaultDropdownParams,
  },
  styles: {
    classNames: [],
    tagStyles: getDefaultStyles('dropdown'),
    idStyles: {},
    classStyles: {},
  },
  name: 'dropdown',
  children: [dropdownMenu],
};

export const video: VideoServerElement = {
  buoyancy: 0,
  func_type: 'video',
  struct_type: 'video',
  parameters: {
    group: 'other',
    ...defaultVideoParams,
  },
  styles: {
    classNames: [],
    tagStyles: getDefaultStyles('video'),
    idStyles: {},
    classStyles: {},
  },
  name: 'video',
  children: [],
};

export const undefined: UndefinedServerElement = {
  buoyancy: 0,
  func_type: 'undefined',
  struct_type: 'undefined',
  parameters: {
    group: 'undefined',
  },
  styles: {
    classNames: [],
    tagStyles: getDefaultStyles('undefined'),
    idStyles: {},
    classStyles: {},
  },
  name: 'undefined',
  children: [],
};
