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
import { IMAGES } from '$constants/images';

import { paragraph } from '../typographyElements/typographyElements';

export const root: RootServerElement = {
  buoyancy: 0,
  func_type: 'root',
  struct_type: 'root',
  parameters: {
    group: 'none',
  },
  styles: {
    classNames: ['root'],
    ownStyles: {},
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
    ownStyles: {},
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
    ownStyles: {},
  },
  name: 'divBlock',
  children: [paragraph], // TODO make custom paragraph
};

export const image: ImageServerElement = {
  buoyancy: 0,
  func_type: 'image',
  struct_type: 'image',
  parameters: {
    group: 'image',
    imageURL: IMAGES.imageIcon,
  },
  styles: {
    classNames: ['image'],
    ownStyles: {},
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
    ownStyles: {},
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
    ownStyles: {},
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
    textContent: 'dropdown',
    showRipple: true,
    isOpen: false,
    dropdownItems: ['First item', 'Second item', 'Third item'], // TODO research why we need items here
  },
  styles: {
    classNames: ['dropdown'],
    ownStyles: {},
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
    videoSettings: {
      link: '',
      autoplay: false,
      start: 0,
      end: 0,
      loop: false,
      rel: true,
    },
  },
  styles: {
    classNames: ['video'],
    ownStyles: {},
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
    ownStyles: {},
  },
  name: 'undefined',
  children: [],
};
