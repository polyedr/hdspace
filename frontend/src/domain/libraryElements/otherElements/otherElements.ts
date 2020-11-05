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
  ServerElement,
  UndefinedServerElement,
  VideoServerElement,
  SmartHeaderServerElement,
  SmartFooterServerElement,
  SmartFormServerElement,
  SmartWebpageServerElement,
} from '../../../api/types';
import { defaultFreeCanvasParams, Entity } from '../../core';
import { IMAGES } from '../../../constants/images';
import { CssLikeStyles } from '../../../utils/StyleHelper';

export const root: RootServerElement = {
  buoyancy: 0,
  func_type: 'root',
  struct_type: 'root',
  parameters: {
    width: 0,
    height: 0,
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
    ...defaultFreeCanvasParams,
    width: '50%',
    height: '50%',
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
  parameters: {
    ...defaultFreeCanvasParams,
    width: '50%',
    height: '50%',
  },
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
  parameters: {
    ...defaultFreeCanvasParams,
    width: '50%',
    height: '50%',
  },
  styles: {
    classNames: ['columns'],
    ownStyles: {},
  },
  children: [],
});

export const makeDivBlock = (textContent: string): DivBlockServerElement => {
  return {
    buoyancy: 0,
    func_type: 'divBlock',
    struct_type: 'divBlock',
    parameters: {
      group: 'containers',
      ...defaultFreeCanvasParams,
      width: '50%',
      height: '50%',
    },
    styles: {
      classNames: ['divBlock'],
      ownStyles: {} as Required<CssLikeStyles>,
    },
    name: 'divBlock',
    children: [makeParagraph({ textContent })],
  };
};

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
    ...defaultFreeCanvasParams,
  },
  styles: {
    classNames: ['image'],
    ownStyles,
  },
  name: 'image',
  children: [],
});

export const makeSmartHeader = ({
  name = 'smartHeader',
  ownStyles = {},
}): SmartHeaderServerElement => ({
  buoyancy: 0,
  func_type: 'smartHeader',
  struct_type: 'smartHeader',
  parameters: {
    group: 'undefined',
    ...defaultFreeCanvasParams,
    width: '50%',
    height: '50%',
  },
  styles: {
    classNames: ['smartHeader'],
    ownStyles: { ...ownStyles } as Required<CssLikeStyles>,
  },
  name,
  children: [],
});

export const makeSmartFooter = ({
  name = 'smartFooter',
  ownStyles = {},
}): SmartFooterServerElement => ({
  buoyancy: 0,
  func_type: 'smartFooter',
  struct_type: 'smartFooter',
  parameters: {
    group: 'undefined',
    ...defaultFreeCanvasParams,
    width: '50%',
    height: '50%',
  },
  styles: {
    classNames: ['smartFooter'],
    ownStyles: { ...ownStyles } as Required<CssLikeStyles>,
  },
  name,
  children: [],
});

export const makeSmartForm = ({
  name = 'smartForm',
  ownStyles = {},
}): SmartFormServerElement => ({
  buoyancy: 0,
  func_type: 'smartForm',
  struct_type: 'smartForm',
  parameters: {
    group: 'undefined',
    ...defaultFreeCanvasParams,
    width: '50%',
    height: '50%',
  },
  styles: {
    classNames: ['smartForm'],
    ownStyles: { ...ownStyles } as Required<CssLikeStyles>,
  },
  name,
  children: [],
});

export const makeSmartWebpage = ({
  name = 'smartWebpage',
  ownStyles = {},
}): SmartWebpageServerElement => ({
  buoyancy: 0,
  func_type: 'smartWebpage',
  struct_type: 'smartWebpage',
  parameters: {
    group: 'undefined',
    ...defaultFreeCanvasParams,
    width: '50%',
    height: '50%',
  },
  styles: {
    classNames: ['smartWebpage'],
    ownStyles: { ...ownStyles } as Required<CssLikeStyles>,
  },
  name,
  children: [],
});

export const makeDropdownItem = (
  textContent: string,
): DropdownItemServerElement => ({
  buoyancy: 0,
  func_type: 'dropdownItem',
  struct_type: 'dropdownItem',
  parameters: {
    textContent,
    ...defaultFreeCanvasParams,
  },
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
  parameters: {
    ...defaultFreeCanvasParams,
  },
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
    ...defaultFreeCanvasParams,
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
    ...defaultFreeCanvasParams,
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
    ...defaultFreeCanvasParams,
    width: '50%',
    height: '50%',
  },
  styles: {
    classNames: ['undefined'],
    ownStyles: {} as Required<CssLikeStyles>,
  },
  name: 'undefined',
  children: [],
};
