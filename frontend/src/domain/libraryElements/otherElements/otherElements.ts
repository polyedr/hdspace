import { makeParagraph } from '../typographyElements/typographyElements';
import {
  ColumnsServerElement,
  ContainerServerElement,
  DivBlockServerElement,
  DropdownItemServerElement,
  DropdownMenuServerElement,
  DropdownServerElement,
  GridServerElement,
  ImageServerElement,
  RootServerElement,
  ScreenshotServerElement,
  ServerElement,
  UndefinedServerElement,
  VideoServerElement,
} from '../../../api/types';
import { Entity } from '../../core';
import { IMAGES } from '../../../constants/images';
import { CssLikeStyles } from '../../../utils/StyleHelper';

export const root: RootServerElement = {
  buoyancy: 0,
  func_type: 'root',
  struct_type: 'root',
  parameters: {
    group: 'none',
  },
  styles: {
    classNames: ['root'],
    ownStyles: {} as Required<CssLikeStyles>,
  },
  name: 'root',
  children: [],
};

export const makeContainer = ({
  children = [],
  ownStyles = {} as Required<CssLikeStyles>,
  name = 'container',
  buoyancy = 0,
}: {
  children?: ServerElement<Entity>[];
  ownStyles?: Required<CssLikeStyles>;
  name?: string;
  buoyancy?: number;
} = {}): ContainerServerElement => ({
  buoyancy,
  func_type: 'container',
  struct_type: 'container',
  parameters: {
    group: 'none',
  },
  styles: {
    classNames: ['container'],
    ownStyles,
  },
  name,
  children,
});

export const makeGrid = (): GridServerElement => ({
  buoyancy: 0,
  name: 'grid',
  func_type: 'grid',
  struct_type: 'grid' as const,
  parameters: {},
  styles: {
    classNames: ['grid'],
    ownStyles: {},
  },
  children: [],
});

export const makeColumns = (): ColumnsServerElement => ({
  buoyancy: 0,
  name: 'columns',
  func_type: 'columns',
  struct_type: 'columns' as const,
  parameters: {},
  styles: {
    classNames: ['columns'],
    ownStyles: {},
  },
  children: [],
});

export const makeDivBlock = (textContent: string): DivBlockServerElement => ({
  buoyancy: 0,
  func_type: 'divBlock',
  struct_type: 'divBlock',
  parameters: {
    group: 'containers',
  },
  styles: {
    classNames: ['divBlock'],
    ownStyles: {} as Required<CssLikeStyles>,
  },
  name: 'divBlock',
  children: [makeParagraph({ textContent })],
});

export const makeImage = ({
  ownStyles = {} as Required<CssLikeStyles>,
}: {
  ownStyles?: Required<CssLikeStyles>;
} = {}): ImageServerElement => ({
  buoyancy: 0,
  func_type: 'image',
  struct_type: 'image',
  parameters: {
    group: 'image',
    imageURL: IMAGES.imageIcon,
  },
  styles: {
    classNames: ['image'],
    ownStyles,
  },
  name: 'image',
  children: [],
});

export const makeScreenshot = ({
  ownStyles,
}: {
  children?: ServerElement<Entity>[];
  ownStyles?: Required<CssLikeStyles>;
} = {}): ScreenshotServerElement => ({
  buoyancy: 0,
  func_type: 'screenshot',
  struct_type: 'screenshot',
  parameters: {
    group: 'undefined',
    imageURL: '',
  },
  styles: {
    classNames: ['screenshot'],
    ownStyles: { ...ownStyles } as Required<CssLikeStyles>,
  },
  name: 'screenshot',
  children: [],
});

export const makeDropdownItem = (
  textContent: string,
): DropdownItemServerElement => ({
  buoyancy: 0,
  func_type: 'dropdownItem',
  struct_type: 'dropdownItem',
  parameters: { textContent },
  styles: {
    classNames: ['dropdownItem'],
    ownStyles: {} as Required<CssLikeStyles>,
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
    ownStyles: {} as Required<CssLikeStyles>,
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
    ownStyles: {} as Required<CssLikeStyles>,
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
    ownStyles: {} as Required<CssLikeStyles>,
  },
  name: 'video',
  children: [],
};

// eslint-disable-next-line no-shadow-restricted-names
export const undefined: UndefinedServerElement = {
  // TODO: RENAME THIS CONST
  buoyancy: 0,
  func_type: 'undefined',
  struct_type: 'undefined',
  parameters: {
    group: 'undefined',
  },
  styles: {
    classNames: ['undefined'],
    ownStyles: {} as Required<CssLikeStyles>,
  },
  name: 'undefined',
  children: [],
};
