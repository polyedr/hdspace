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
  ElementsGroupServerElement,
  Entity,
  GridItemServerElement,
  GridServerElement,
  ImageServerElement,
  NativeColumnsServerElement,
  RootServerElement,
  ServerElement,
  SmartFooterServerElement,
  SmartFormServerElement,
  SmartHeaderServerElement,
  SmartWebpageServerElement,
  UndefinedServerElement,
  HTMLServerElement,
  VideoServerElement,
} from '@Src/types';
import { DEFAULT_LAYOUT_LIST } from '@Constants/defaultParams';
import { makeParagraph } from '../typographyElements/typographyElements';
import { defaultFreeCanvasParams } from '../../core';

export const root: RootServerElement = {
  id: 'root',
  buoyancy: 0,
  func_type: 'root',
  struct_type: 'root',
  parameters: {
    layouts: DEFAULT_LAYOUT_LIST,
    freeCanvas: defaultFreeCanvasParams,
    group: ElementGroup.NONE,
  },
  styles: {
    classNames: ['root'],
    ownStyles: {},
  },
  name: 'root',
  children: [],
};

export const elementsGroup: ElementsGroupServerElement = {
  id: 'elementsGroup',
  buoyancy: 0,
  func_type: 'group',
  struct_type: 'group',
  parameters: {
    layouts: DEFAULT_LAYOUT_LIST,
    freeCanvas: defaultFreeCanvasParams,
    group: ElementGroup.CONTAINERS,
  },
  styles: {
    classNames: ['group'],
    ownStyles: {},
  },
  name: 'Group',
  children: [],
};

export const makeContainer = ({
  children = [],
  ownStyles = {},
  name = 'container',
  buoyancy = 0,
  UID = 'master',
}: {
  children?: ServerElement<Entity>[];
  ownStyles?: React.CSSProperties;
  name?: string;
  buoyancy?: number;
  UID?: string;
} = {}): ContainerServerElement => ({
  id: `container-${UID}`,
  buoyancy,
  func_type: 'container',
  struct_type: 'container',
  parameters: {
    layouts: DEFAULT_LAYOUT_LIST,
    group: ElementGroup.CONTAINERS,
    freeCanvas: {
      ...defaultFreeCanvasParams,
    },
  },
  styles: {
    classNames: ['container'],
    ownStyles,
  },
  name,
  children,
});

export const makeGridItem = ({
  UID = 'master',
} = {}): GridItemServerElement => ({
  id: `gridItem-${UID}`,
  buoyancy: 0,
  name: 'gridItem',
  func_type: 'gridItem',
  struct_type: 'gridItem' as const,
  parameters: {
    layouts: DEFAULT_LAYOUT_LIST,
    freeCanvas: {
      ...defaultFreeCanvasParams,
    },
    group: ElementGroup.CONTAINERS,
  },
  styles: {
    classNames: ['gridItem'],
    ownStyles: {},
  },
  children: [],
});

export const makeGrid = ({
  items = [
    makeGridItem({ UID: '1' }),
    makeGridItem({ UID: '2' }),
    makeGridItem({ UID: '3' }),
    makeGridItem({ UID: '4' }),
  ],
  UID = 'master',
}: {
  items?: GridItemServerElement[];
  UID?: string;
} = {}): GridServerElement => ({
  id: `grid-${UID}`,
  buoyancy: 0,
  name: 'grid',
  func_type: 'grid',
  struct_type: 'grid' as const,
  parameters: {
    layouts: DEFAULT_LAYOUT_LIST,
    freeCanvas: {
      ...defaultFreeCanvasParams,
    },
    group: ElementGroup.OTHER,
  },
  styles: {
    classNames: ['grid'],
    ownStyles: {},
  },
  children: items,
});

export const column: ColumnServerElement = {
  id: 'column',
  buoyancy: 0,
  name: 'column',
  func_type: 'column',
  struct_type: 'column' as const,
  parameters: {
    layouts: DEFAULT_LAYOUT_LIST,
    freeCanvas: {
      ...defaultFreeCanvasParams,
    },
    group: ElementGroup.CONTAINERS,
  },
  styles: {
    classNames: ['column'],
    ownStyles: {},
  },
  children: [],
};

export const makeColumn = ({ UID = 'master' }): ColumnServerElement => ({
  id: `column-${UID}`,
  buoyancy: 0,
  name: 'column',
  func_type: 'column',
  struct_type: 'column' as const,
  parameters: {
    layouts: DEFAULT_LAYOUT_LIST,
    freeCanvas: {
      ...defaultFreeCanvasParams,
    },
    group: ElementGroup.CONTAINERS,
  },
  styles: {
    classNames: ['column'],
    ownStyles: {},
  },
  children: [],
});

export const makeColumns = (
  columnsCount: number = 2,
): ColumnsServerElement => ({
  id: 'columns',
  buoyancy: 0,
  name: 'columns',
  func_type: 'columns',
  struct_type: 'columns' as const,
  parameters: {
    layouts: DEFAULT_LAYOUT_LIST,
    freeCanvas: {
      ...defaultFreeCanvasParams,
    },
    group: ElementGroup.OTHER,
  },
  styles: {
    classNames: ['columns'],
    ownStyles: {},
  },
  children: Array.from(Array(columnsCount)).map((_undefined, index) => {
    return makeColumn({ UID: `${index}` });
  }),
});

export const nativeColumns: NativeColumnsServerElement = {
  id: 'nativeColumns',
  buoyancy: 0,
  name: 'nativeColumns',
  func_type: 'nativeColumns',
  struct_type: 'nativeColumns' as const,
  parameters: {
    layouts: DEFAULT_LAYOUT_LIST,
    freeCanvas: {
      ...defaultFreeCanvasParams,
    },
    group: ElementGroup.CONTAINERS,
  },
  styles: {
    classNames: ['nativeColumns'],
    ownStyles: {},
  },
  children: [],
};

export const makeDivBlock = ({
  textContent,
  UID = 'master',
}): DivBlockServerElement => {
  return {
    id: `divBlock-${UID}`,
    buoyancy: 0,
    func_type: 'divBlock',
    struct_type: 'divBlock',
    parameters: {
      layouts: DEFAULT_LAYOUT_LIST,
      group: ElementGroup.CONTAINERS,
      freeCanvas: {
        ...defaultFreeCanvasParams,
      },
    },
    styles: {
      classNames: ['divBlock'],
      ownStyles: {},
    },
    name: 'divBlock',
    children: [makeParagraph({ textContent, UID: 'divBlock-0' })],
  };
};

export const makeImage = ({
  ownStyles = {},
  UID = 'master',
} = {}): ImageServerElement => ({
  id: `image-${UID}`,
  buoyancy: 0,
  func_type: 'image',
  struct_type: 'image',
  parameters: {
    alt: '',
    title: '',
    layouts: DEFAULT_LAYOUT_LIST,
    group: ElementGroup.IMAGE,
    imageURL: IMAGES.imageIcon,
    freeCanvas: {
      ...defaultFreeCanvasParams,
      width: 300,
      height: 300,
    },
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
  UID = 'master',
}): SmartHeaderServerElement => ({
  id: `smart-header-${UID}`,
  buoyancy: 0,
  func_type: 'smartHeader',
  struct_type: 'smartHeader',
  parameters: {
    layouts: DEFAULT_LAYOUT_LIST,
    group: ElementGroup.UNDEFINED,
    freeCanvas: {
      ...defaultFreeCanvasParams,
    },
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
  UID = 'master',
}): SmartFooterServerElement => ({
  id: `smart-footer-${UID}`,
  buoyancy: 0,
  func_type: 'smartFooter',
  struct_type: 'smartFooter',
  parameters: {
    layouts: DEFAULT_LAYOUT_LIST,
    group: ElementGroup.UNDEFINED,
    freeCanvas: {
      ...defaultFreeCanvasParams,
    },
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
  UID = 'master',
}): SmartFormServerElement => ({
  id: `smart-form-${UID}`,
  buoyancy: 0,
  func_type: 'smartForm',
  struct_type: 'smartForm',
  parameters: {
    layouts: DEFAULT_LAYOUT_LIST,
    group: ElementGroup.UNDEFINED,
    freeCanvas: {
      ...defaultFreeCanvasParams,
    },
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
  UID = 'master',
}): SmartWebpageServerElement => ({
  id: `smart-webpage-${UID}`,
  buoyancy: 0,
  func_type: 'smartWebpage',
  struct_type: 'smartWebpage',
  parameters: {
    layouts: DEFAULT_LAYOUT_LIST,
    group: ElementGroup.UNDEFINED,
    freeCanvas: {
      ...defaultFreeCanvasParams,
    },
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
  UID = 'master',
): DropdownItemServerElement => ({
  id: `dropdown-item-${UID}`,
  buoyancy: 0,
  func_type: 'dropdownItem',
  struct_type: 'dropdownItem',
  parameters: {
    layouts: DEFAULT_LAYOUT_LIST,
    textContent,
    freeCanvas: defaultFreeCanvasParams,
    group: ElementGroup.OTHER,
  },
  styles: {
    classNames: ['dropdownItem'],
    ownStyles: {},
  },
  name: 'dropdownItem',
  children: [],
});

export const dropdownMenu: DropdownMenuServerElement = {
  id: 'dropdown-menu',
  buoyancy: 0,
  func_type: 'dropdownMenu',
  struct_type: 'dropdownMenu',
  parameters: {
    layouts: DEFAULT_LAYOUT_LIST,
    freeCanvas: defaultFreeCanvasParams,
    group: ElementGroup.OTHER,
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
  id: 'dropdown',
  buoyancy: 0,
  func_type: 'dropdown',
  struct_type: 'dropdown',
  parameters: {
    layouts: DEFAULT_LAYOUT_LIST,
    group: ElementGroup.OTHER,
    textContent: 'dropdown',
    showRipple: true,
    isOpen: false,
    dropdownItems: ['First item', 'Second item', 'Third item'], // TODO research why we need items here
    freeCanvas: defaultFreeCanvasParams,
  },
  styles: {
    classNames: ['dropdown'],
    ownStyles: {},
  },
  name: 'dropdown',
  children: [dropdownMenu],
};

export const video: VideoServerElement = {
  id: 'video',
  buoyancy: 0,
  func_type: 'video',
  struct_type: 'video',
  parameters: {
    layouts: DEFAULT_LAYOUT_LIST,
    group: ElementGroup.OTHER,
    freeCanvas: {
      ...defaultFreeCanvasParams,
      width: 640,
      height: 480,
    },
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

export const undefinedElement: UndefinedServerElement = {
  id: 'undefined',
  buoyancy: 0,
  func_type: 'undefined',
  struct_type: 'undefined',
  parameters: {
    layouts: DEFAULT_LAYOUT_LIST,
    group: ElementGroup.UNDEFINED,
    freeCanvas: {
      ...defaultFreeCanvasParams,
      width: 100,
      height: 100,
    },
  },
  styles: {
    classNames: ['undefined'],
    ownStyles: {},
  },
  name: 'undefined',
  children: [],
};

export const htmlElement: HTMLServerElement = {
  id: 'html',
  buoyancy: 0,
  func_type: 'html',
  struct_type: 'html',
  parameters: {
    layouts: DEFAULT_LAYOUT_LIST,
    group: ElementGroup.UNDEFINED,
    freeCanvas: {
      ...defaultFreeCanvasParams,
      width: 100,
      height: 100,
    },
    tag: 'div',
    attributes: {
      name: 'HTML element',
    },
  },
  styles: {
    classNames: [],
    ownStyles: {},
  },
  name: 'HTML element',
  children: [],
};
