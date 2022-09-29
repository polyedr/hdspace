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
  HTMLServerElement,
  VideoServerElement,
  PaginationItemServerElement,
  PaginationServerElement,
  BreadcrumbServerElement,
  BreadcrumbItemServerElement,
  CarouselServerElement,
  CarouselItemServerElement,
  NavbarServerElement,
  NavbarItemServerElement,
  ImagesListServerElement,
} from '@Src/types';
import { DEFAULT_LAYOUT_LIST } from '@Constants/defaultParams';
import { makeParagraph } from '../typographyElements/typographyElements';
import { defaultFreeCanvasParams } from '../../core';

export const makeRoot = (): RootServerElement => ({
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
    pseudoClassStyles: {},
  },
  name: 'root',
  children: [],
});

export const makeElementsGroup = (): ElementsGroupServerElement => ({
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
    pseudoClassStyles: {},
  },
  name: 'Group',
  children: [],
});

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
    pseudoClassStyles: {},
  },
  name,
  children,
});

export const makeGridItem = ({
  UID = 'master',
  buoyancy = 0,
} = {}): GridItemServerElement => ({
  id: `gridItem-${UID}`,
  buoyancy,
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
    pseudoClassStyles: {},
  },
  children: [],
});

export const makeGrid = ({
  items = [
    makeGridItem({ UID: '1', buoyancy: 0 }),
    makeGridItem({ UID: '2', buoyancy: 0 }),
    makeGridItem({ UID: '3', buoyancy: 0 }),
    makeGridItem({ UID: '4', buoyancy: 0 }),
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
    pseudoClassStyles: {},
  },
  children: items,
});

export const makeColumn = ({
  UID = 'master',
  buoyancy = 0,
} = {}): ColumnServerElement => ({
  id: `column-${UID}`,
  buoyancy,
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
    pseudoClassStyles: {},
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
    pseudoClassStyles: {},
  },
  children: Array.from(Array(columnsCount)).map((_undefined, index) => {
    return makeColumn({ UID: `${index}`, buoyancy: index });
  }),
});

export const makeNativeColumns = (): NativeColumnsServerElement => ({
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
    pseudoClassStyles: {},
  },
  children: [],
});

export const makeDivBlock = (
  { textContent, UID = 'master' } = { textContent: 'This is a divBlock' },
): DivBlockServerElement => {
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
      pseudoClassStyles: {},
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
    alt: 'Default alt',
    title: 'Default title',
    layouts: DEFAULT_LAYOUT_LIST,
    group: ElementGroup.IMAGE,
    imageURL: IMAGES.imageIcon,
    freeCanvas: {
      ...defaultFreeCanvasParams,
      width: 300,
      height: 300,
    },
    keepAspectRatio: false,
  },
  styles: {
    classNames: ['image'],
    ownStyles,
    pseudoClassStyles: {},
  },
  name: 'image',
  children: [],
});

export const makeImagesList = ({
  UID = 'master',
} = {}): ImagesListServerElement => ({
  id: `images-list-${UID}`,
  buoyancy: 0,
  func_type: 'images-list',
  struct_type: 'imagesList',
  parameters: {
    images: [],
    name: 'images list',
    columns: 3,
    layouts: DEFAULT_LAYOUT_LIST,
    group: ElementGroup.IMAGE,
    freeCanvas: {
      ...defaultFreeCanvasParams,
    },
  },
  styles: {
    classNames: ['imagesList'],
    ownStyles: {},
    pseudoClassStyles: {},
  },
  name: 'images list',
  children: [
    makeImage({ ownStyles: { width: '150px', height: '150px' } }),
    makeImage({ ownStyles: { width: '150px', height: '150px' } }),
    makeImage({ ownStyles: { width: '150px', height: '150px' } }),
  ],
});

export const makeSmartHeader = (
  { name = 'smartHeader', ownStyles = {}, UID = 'master' } = {
    name: 'Smart Header',
  },
): SmartHeaderServerElement => ({
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
    pseudoClassStyles: {},
  },
  name,
  children: [],
});

export const makeSmartFooter = (
  { name = 'smartFooter', ownStyles = {}, UID = 'master' } = {
    name: 'Smart Footer',
  },
): SmartFooterServerElement => ({
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
    pseudoClassStyles: {},
  },
  name,
  children: [],
});

export const makeSmartForm = (
  { name = 'smartForm', ownStyles = {}, UID = 'master' } = {
    name: 'Smart Form',
  },
): SmartFormServerElement => ({
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
    pseudoClassStyles: {},
  },
  name,
  children: [],
});

export const makeSmartWebpage = (
  { name = 'smartWebpage', ownStyles = {}, UID = 'master' } = {
    name: 'Smart Webpage',
  },
): SmartWebpageServerElement => ({
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
    pseudoClassStyles: {},
  },
  name,
  children: [],
});

export const makeDropdownItem = (
  { textContent, UID = 'master', buoyancy = 0 } = { textContent: '' },
): DropdownItemServerElement => ({
  id: `dropdown-item-${UID}`,
  buoyancy,
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
    pseudoClassStyles: {},
  },
  name: 'dropdownItem',
  children: [],
});

export const makeDropdownMenu = (): DropdownMenuServerElement => ({
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
    pseudoClassStyles: {},
  },
  name: 'dropdownMenu',
  children: [
    makeDropdownItem({ textContent: 'First option' }),
    makeDropdownItem({ textContent: 'Second option' }),
    makeDropdownItem({ textContent: 'Third option' }),
  ],
});

export const makeDropdown = (): DropdownServerElement => ({
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
    pseudoClassStyles: {},
  },
  name: 'dropdown',
  children: [makeDropdownMenu()],
});

export const makeVideo = (): VideoServerElement => ({
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
    pseudoClassStyles: {},
  },
  name: 'video',
  children: [],
});

export const makeHtmlElement = (): HTMLServerElement => ({
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
    pseudoClassStyles: {},
  },
  name: 'HTML element',
  children: [],
});

export const makeBreadcrumbItem = ({
  textContent = '',
  UID = 'master',
  buoyancy = 0,
} = {}): BreadcrumbItemServerElement => ({
  id: `breadcrumb-item-${UID}`,
  buoyancy,
  func_type: 'breadcrumbItem',
  struct_type: 'breadcrumbItem',
  parameters: {
    layouts: DEFAULT_LAYOUT_LIST,
    freeCanvas: defaultFreeCanvasParams,
    group: ElementGroup.OTHER,
    textContent,
    isLink: false,
  },
  styles: {
    classNames: ['breadcrumbItem'],
    ownStyles: {},
    pseudoClassStyles: {},
  },
  name: 'breadcrumbItem',
  children: [],
});

export const makeBreadcrumb = (): BreadcrumbServerElement => ({
  id: 'breadcrumb',
  buoyancy: 0,
  func_type: 'breadcrumb',
  struct_type: 'breadcrumb',
  parameters: {
    layouts: DEFAULT_LAYOUT_LIST,
    freeCanvas: defaultFreeCanvasParams,
    group: ElementGroup.TYPOGRAPHY,
    breadcrumbItems: [
      // TODO research why we need items here
      { textContent: 'breadcrumb item', isLink: false },
      { textContent: 'Second breadcrumb', isLink: false },
      { textContent: 'Third breadcrumb', isLink: false },
    ],
  },
  styles: {
    classNames: ['breadcrumb'],
    ownStyles: {},
    pseudoClassStyles: {},
  },
  name: 'breadcrumb',
  children: [
    makeBreadcrumbItem({
      textContent: 'breadcrumb item',
      UID: 'breadcrumb-1',
      buoyancy: 0,
    }),
    makeBreadcrumbItem({
      textContent: 'Second breadcrumb',
      UID: 'breadcrumb-2',
      buoyancy: 1,
    }),
    makeBreadcrumbItem({
      textContent: 'Third breadcrumb',
      UID: 'breadcrumb-3',
      buoyancy: 2,
    }),
  ],
});
export const makePaginationItem = ({
  textContent = '',
  UID = 'master',
  buoyancy = 0,
} = {}): PaginationItemServerElement => ({
  id: `pagination-item-${UID}`,
  buoyancy,
  func_type: 'paginationItem',
  struct_type: 'paginationItem',
  parameters: {
    layouts: DEFAULT_LAYOUT_LIST,
    freeCanvas: defaultFreeCanvasParams,
    group: ElementGroup.OTHER,
    textContent,
    isActiveLink: false,
  },
  styles: {
    classNames: ['paginationItem'],
    ownStyles: {},
    pseudoClassStyles: {},
  },
  name: 'paginationItem',
  children: [],
});

export const makePagination = (): PaginationServerElement => ({
  id: 'pagination',
  buoyancy: 0,
  func_type: 'pagination',
  struct_type: 'pagination',
  parameters: {
    layouts: DEFAULT_LAYOUT_LIST,
    freeCanvas: defaultFreeCanvasParams,
    group: ElementGroup.TYPOGRAPHY,
    paginationItems: [
      // TODO research why we need items here
      { textContent: '1' },
      { textContent: '2' },
      { textContent: '3' },
    ],
  },
  styles: {
    classNames: ['pagination'],
    ownStyles: {},
    pseudoClassStyles: {},
  },
  name: 'pagination',
  children: [
    makePaginationItem({
      textContent: '1',
      UID: 'pagination-1',
      buoyancy: 0,
    }),
    makePaginationItem({
      textContent: '2',
      UID: 'pagination-2',
      buoyancy: 1,
    }),
    makePaginationItem({
      textContent: '3',
      UID: 'pagination-3',
      buoyancy: 2,
    }),
  ],
});

export const makeCarouselItem = ({
  link = '',
  alt = '',
  UID = 'master',
  buoyancy = 0,
} = {}): CarouselItemServerElement => ({
  id: `carousel-item-${UID}`,
  buoyancy,
  func_type: 'carouselItem',
  struct_type: 'carouselItem',
  parameters: {
    layouts: DEFAULT_LAYOUT_LIST,
    freeCanvas: defaultFreeCanvasParams,
    group: ElementGroup.OTHER,
    link,
    alt,
  },
  styles: {
    classNames: ['carouselItem'],
    ownStyles: {},
    pseudoClassStyles: {},
  },
  name: 'carouselItem',
  children: [],
});

export const makeCarousel = (): CarouselServerElement => ({
  id: 'carousel',
  buoyancy: 0,
  func_type: 'carousel',
  struct_type: 'carousel',
  parameters: {
    layouts: DEFAULT_LAYOUT_LIST,
    freeCanvas: defaultFreeCanvasParams,
    group: ElementGroup.TYPOGRAPHY,
    carouselItems: [
      // TODO research why we need items here
      {
        link: 'https://www.yana.kiev.ua/img/countries/big/21/1917977906.jpg',
        alt: 'text desc',
      },
      {
        link: 'https://pbs.twimg.com/media/CekF6jHWAAAdb9q.jpg',
        alt: 'text desc',
      },
      {
        link: 'https://planetaperm.ru/wp-content/uploads/banner-minvody.jpg',
        alt: 'text desc',
      },
    ],
  },
  styles: {
    classNames: ['carousel'],
    ownStyles: {},
    pseudoClassStyles: {},
  },
  name: 'carousel',
  children: [
    makeCarouselItem({
      link: 'https://www.yana.kiev.ua/img/countries/big/21/1917977906.jpg',
      alt: 'text desc',
      UID: 'carousel-1',
      buoyancy: 0,
    }),
    makeCarouselItem({
      link: 'https://pbs.twimg.com/media/CekF6jHWAAAdb9q.jpg',
      alt: 'text desc',
      UID: 'carousel-2',
      buoyancy: 1,
    }),
    makeCarouselItem({
      link: 'https://planetaperm.ru/wp-content/uploads/banner-minvody.jpg',
      alt: 'text desc',
      UID: 'carousel-3',
      buoyancy: 2,
    }),
  ],
});

export const makeNavbarItem = ({
  link = '',
  itemName = '',
  UID = 'master',
  buoyancy = 0,
} = {}): NavbarItemServerElement => ({
  id: `navbar-item-${UID}`,
  buoyancy,
  func_type: 'navbarItem',
  struct_type: 'navbarItem',
  parameters: {
    layouts: DEFAULT_LAYOUT_LIST,
    freeCanvas: defaultFreeCanvasParams,
    group: ElementGroup.OTHER,
    link,
    itemName,
  },
  styles: {
    classNames: ['navbarItem'],
    ownStyles: {},
    pseudoClassStyles: {},
  },
  name: 'navbarItem',
  children: [],
});

export const makeNavbar = (): NavbarServerElement => ({
  id: 'navbar',
  buoyancy: 0,
  func_type: 'navbar',
  struct_type: 'navbar',
  parameters: {
    titleName: 'ADEVI',
    titleLink: '',
    layouts: DEFAULT_LAYOUT_LIST,
    freeCanvas: defaultFreeCanvasParams,
    group: ElementGroup.TYPOGRAPHY,
    navbarItems: [
      // TODO research why we need items here
      {
        link: 'https://i5.walmartimages.com/asr/79b030ef-9b02-43ae-bc88-2b278eebf068_1.cd9af79d4e8b836b8d5a1c476dfe468e.png',
        itemName: 'text desc',
      },
      {
        link: 'https://i5.walmartimages.com/asr/79b030ef-9b02-43ae-bc88-2b278eebf068_1.cd9af79d4e8b836b8d5a1c476dfe468e.png',
        itemName: 'text desc',
      },
      {
        link: 'https://i5.walmartimages.com/asr/79b030ef-9b02-43ae-bc88-2b278eebf068_1.cd9af79d4e8b836b8d5a1c476dfe468e.png',
        itemName: 'text desc',
      },
    ],
  },
  styles: {
    classNames: ['navbar'],
    ownStyles: {},
    pseudoClassStyles: {},
  },
  name: 'navbar',
  children: [
    makeNavbarItem({
      link: 'https://i5.walmarti',
      itemName: 'text desc',
      UID: 'carousel-1',
      buoyancy: 0,
    }),
    makeNavbarItem({
      link: 'https://i5.walmarti',
      itemName: 'text desc',
      UID: 'navbar-2',
      buoyancy: 1,
    }),
    makeNavbarItem({
      link: 'https://i5.walmartimages.com/asr/79b030ef-9b0d9af79d4e8b836b8d5a1c476dfe46',
      itemName: 'text desc',
      UID: 'navbar-3',
      buoyancy: 2,
    }),
  ],
});
