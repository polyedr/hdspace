import {
  RootServerElement,
  ContainerServerElement,
  ImageServerElement,
  DropdownItemServerElement,
  DropdownMenuServerElement,
  DropdownServerElement,
  VideoServerElement,
  UndefinedServerElement,
} from '$api/types';

export const root: RootServerElement = {
  buoyancy: 0,
  func_type: 'root',
  struct_type: 'root',
  parameters: {
    group: 'none',
  },
  styles: {},
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
  styles: {},
  name: 'container',
  children: [],
};

export const image: Omit<ImageServerElement, 'parameters'> & { parameters: { group: string } } = {
  buoyancy: 0,
  func_type: 'image',
  struct_type: 'image',
  parameters: {
    group: 'image',
  },
  styles: {},
  name: 'image',
  children: [],
};

export const makeDropdownItem = (textContent: string): DropdownItemServerElement => ({
  buoyancy: 0,
  func_type: 'dropdownItem',
  struct_type: 'dropdownItem',
  parameters: { textContent },
  styles: {},
  name: 'dropdownItem',
  children: [],
});

export const dropdownMenu: DropdownMenuServerElement = {
  buoyancy: 0,
  func_type: 'dropdownMenu',
  struct_type: 'dropdownMenu',
  parameters: {},
  styles: {},
  name: 'dropdownMenu',
  children: [
    makeDropdownItem('First option'),
    makeDropdownItem('Second option'),
    makeDropdownItem('Third option'),
  ],
};

export const dropdown: Omit<DropdownServerElement, 'parameters'> & { parameters: { group: string } } = {
  buoyancy: 0,
  func_type: 'dropdown',
  struct_type: 'dropdown',
  parameters: {
    group: 'other',
  },
  styles: {},
  name: 'dropdown',
  children: [dropdownMenu],
};

export const video: Omit<VideoServerElement, 'parameters'> & { parameters: { group: string } } = {
  buoyancy: 0,
  func_type: 'video',
  struct_type: 'video',
  parameters: {
    group: 'other',
  },
  styles: {},
  name: 'video',
  children: [],
};

export const undefined: Omit<UndefinedServerElement, 'parameters'> & { parameters: { group: string } } = {
  buoyancy: 0,
  func_type: 'undefined',
  struct_type: 'undefined',
  parameters: {
    group: 'undefined',
  },
  styles: {},
  name: 'undefined',
  children: [],
};
