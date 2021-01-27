import IMAGES from '@Constants/images';
import {
  ColumnServerElement,
  ColumnsServerElement,
  ContainerServerElement,
  DivBlockServerElement,
  DropdownItemServerElement,
  DropdownMenuServerElement,
  DropdownServerElement,
  ElementGroup,
  Entity,
  GridServerElement,
  ImageServerElement,
  RootServerElement,
  ServerElement,
  SmartFooterServerElement,
  SmartFormServerElement,
  SmartHeaderServerElement,
  SmartWebpageServerElement,
  UndefinedServerElement,
  VideoServerElement,
} from '@Src/types';
import { makeParagraph } from '../typographyElements/typographyElements';
import { defaultFreeCanvasParams } from '../../core';

export const root: RootServerElement = {
  buoyancy: 0,
  func_type: 'root',
  struct_type: 'root',
  parameters: {
    width: 0,
    height: 0,
    group: ElementGroup.NONE,
  },
  styles: {
    classNames: ['root'],
    ownStyles: {},
  },
  name: 'root',
  children: [],
};

export const makeContainer = ({
  children = [],
  ownStyles = {},
  name = 'container',
  buoyancy = 0,
}: {
  children?: ServerElement<Entity>[];
  ownStyles?: React.CSSProperties;
  name?: string;
  buoyancy?: number;
} = {}): ContainerServerElement => ({
  buoyancy,
  func_type: 'container',
  struct_type: 'container',
  parameters: {
    group: ElementGroup.NONE,
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

export const makeGridItem = () => ({
  buoyancy: 0,
  name: 'gridItem',
  func_type: 'gridItem',
  struct_type: 'gridItem' as const,
  parameters: {
    ...defaultFreeCanvasParams,
    width: '50%',
    height: '50%',
  },
  styles: {
    classNames: ['gridItem'],
    ownStyles: {},
  },
  children: [],
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
  children: [makeGridItem(), makeGridItem(), makeGridItem(), makeGridItem()],
});

export const column: ColumnServerElement = {
  buoyancy: 0,
  name: 'column',
  func_type: 'column',
  struct_type: 'column' as const,
  parameters: {
    ...defaultFreeCanvasParams,
    width: '50%',
    height: '50%',
  },
  styles: {
    classNames: ['column'],
    ownStyles: {},
  },
  children: [],
};

export const makeColumns = (
  columnsCount: number = 2,
): ColumnsServerElement => ({
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
  children: new Array(columnsCount).fill(column),
});

export const nativeColumns = {
  buoyancy: 0,
  name: 'nativeColumns',
  func_type: 'nativeColumns',
  struct_type: 'nativeColumns' as const,
  parameters: {
    ...defaultFreeCanvasParams,
    width: '50%',
    height: '50%',
  },
  styles: {
    classNames: ['nativeColumns'],
    ownStyles: {},
  },
  children: [],
};

export const makeDivBlock = (textContent: string): DivBlockServerElement => {
  return {
    buoyancy: 0,
    func_type: 'divBlock',
    struct_type: 'divBlock',
    parameters: {
      group: ElementGroup.CONTAINERS,
      ...defaultFreeCanvasParams,
      width: '50%',
      height: '50%',
    },
    styles: {
      classNames: ['divBlock'],
      ownStyles: {},
    },
    name: 'divBlock',
    children: [makeParagraph({ textContent })],
  };
};

export const makeImage = ({
  ownStyles = {},
}: {
  ownStyles?: React.CSSProperties;
} = {}): ImageServerElement => ({
  buoyancy: 0,
  func_type: 'image',
  struct_type: 'image',
  parameters: {
    group: ElementGroup.IMAGE,
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
    group: ElementGroup.UNDEFINED,
    ...defaultFreeCanvasParams,
    width: '50%',
    height: '50%',
    stylesOn: true,
  },
  styles: {
    classNames: ['smartHeader'],
    ownStyles: { ...ownStyles },
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
    group: ElementGroup.UNDEFINED,
    ...defaultFreeCanvasParams,
    width: '50%',
    height: '50%',
    stylesOn: true,
  },
  styles: {
    classNames: ['smartFooter'],
    ownStyles: { ...ownStyles },
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
    group: ElementGroup.UNDEFINED,
    ...defaultFreeCanvasParams,
    width: '50%',
    height: '50%',
    stylesOn: true,
  },
  styles: {
    classNames: ['smartForm'],
    ownStyles: { ...ownStyles },
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
    group: ElementGroup.UNDEFINED,
    ...defaultFreeCanvasParams,
    width: '50%',
    height: '50%',
    stylesOn: true,
  },
  styles: {
    classNames: ['smartWebpage'],
    ownStyles: { ...ownStyles },
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
    ownStyles: {},
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
    group: ElementGroup.OTHER,
    textContent: 'dropdown',
    showRipple: true,
    isOpen: false,
    dropdownItems: ['First item', 'Second item', 'Third item'], // TODO research why we need items here
    ...defaultFreeCanvasParams,
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
    group: ElementGroup.OTHER,
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
    ownStyles: {},
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
    group: ElementGroup.UNDEFINED,
    ...defaultFreeCanvasParams,
    width: '50%',
    height: '50%',
  },
  styles: {
    classNames: ['undefined'],
    ownStyles: {},
  },
  name: 'undefined',
  children: [],
};
