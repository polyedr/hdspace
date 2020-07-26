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
    classNames: ['root'],
    idStyles: {},
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
    classNames: ['container'],
    idStyles: {},
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
    classNames: ['divBlock'],
    idStyles: {},
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
    classNames: ['image'],
    idStyles: {},
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
    classNames: ['dropdownItem'],
    idStyles: {},
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
    classNames: ['dropdownMenu'],
    idStyles: {},
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
    classNames: ['dropdown'],
    idStyles: {},
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
    classNames: ['video'],
    idStyles: {},
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
    classNames: ['undefined'],
    idStyles: {},
  },
  name: 'undefined',
  children: [],
};
