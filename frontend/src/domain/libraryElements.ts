import { CSSProperties } from 'react';

import { ServerStructType } from '$redux/project/types';
import { CssLikeStyles } from '$utils/StyleHelper';

export type LibraryElementType = {
  buoyancy: number,
  func_type: ServerStructType,
  struct_type: ServerStructType,
  parameters: any,
  styles: CSSProperties,
  name: ServerStructType,
  children: LibraryElementType[],
}

export type LibraryElement = Partial<Record<ServerStructType, LibraryElementType>>;

type CommonLibraryElement<Type, ChildrenType> = {
  buoyancy: number,
  func_type: Type,
  struct_type: Type,
  name: Type,
  styles: CssLikeStyles,
  parameters: {
    group: string,
  },
  children: ChildrenType,
}

type LibraryMenuChild = Omit<CommonLibraryElement<'menu', []>, 'parameters'> & {
  parameters: {},
};

type LibraryMenuItemChild = Omit<CommonLibraryElement<'menuItem', []>, 'parameters'> & {
  parameters: {},
};

type DefaultChild = Omit<CommonLibraryElement<'root', []>, 'parameters'> & {
  parameters: {},
};

type SelectChild = LibraryMenuChild | LibraryMenuItemChild;

export type AllChildren = (DefaultChild | SelectChild)[];

export type LibraryRootElement = CommonLibraryElement<'root', DefaultChild[]> ;
export type LibraryContainer = CommonLibraryElement<'container', DefaultChild[]> ;
export type LibraryImageElement = CommonLibraryElement<'image', DefaultChild[]> ;
export type LibraryButtonElement = CommonLibraryElement<'button', DefaultChild[]>;
export type LibraryHyperlinkElement = CommonLibraryElement<'hyperlink', DefaultChild[]>;
export type LibraryTextinputElement = CommonLibraryElement<'textinput', DefaultChild[]>;
export type LibraryCheckboxElement = CommonLibraryElement<'checkbox', DefaultChild[]> & { parameters: { defaultChecked: boolean } };
export type LibraryRadiobuttonElement = CommonLibraryElement<'radiobutton', DefaultChild[]>;
export type LibrarySelectElement = CommonLibraryElement<'select', SelectChild[]>;
export type LibraryOcrtextElement = CommonLibraryElement<'ocrtext', DefaultChild[]>;
export type LibraryMapElement = CommonLibraryElement<'map', DefaultChild[]>;
export type LibraryCalendarElement = CommonLibraryElement<'calendar', DefaultChild[]>;
export type LibraryClockElement = CommonLibraryElement<'clock', DefaultChild[]>;
export type LibraryUndefinedElement = CommonLibraryElement<'undefined', DefaultChild[]>;

export type LibraryElements = {
  root: LibraryRootElement,
  container: LibraryRootElement,
  image: LibraryImageElement,
  button: LibraryButtonElement,
  hyperlink: LibraryHyperlinkElement,
  textinput: LibraryTextinputElement,
  checkbox: LibraryCheckboxElement,
  radiobutton: LibraryRadiobuttonElement,
  select: LibrarySelectElement,
  ocrtext: LibraryOcrtextElement,
  map: LibraryMapElement,
  calendar: LibraryCalendarElement,
  clock: LibraryClockElement,
  undefined: LibraryUndefinedElement,
};

export type ElementsToAdd = Omit<LibraryElements, 'root' | 'container'>;

// WARN: every time you add or remove some LibraryElements in prod, you must write migration in db
export const LIBRARY_ELEMENTS: ElementsToAdd = {
  image: {
    buoyancy: 0,
    func_type: 'image',
    struct_type: 'image',
    parameters: {
      group: 'image',
    },
    styles: {},
    name: 'image',
    children: [],
  },
  button: {
    buoyancy: 1,
    func_type: 'button',
    struct_type: 'button',
    parameters: {
      group: 'form',
    },
    styles: {},
    name: 'button',
    children: [],
  },
  hyperlink: {
    buoyancy: 2,
    func_type: 'hyperlink',
    struct_type: 'hyperlink',
    parameters: {
      group: 'other',
    },
    styles: {},
    name: 'hyperlink',
    children: [],
  },
  textinput: {
    buoyancy: 0,
    func_type: 'textinput',
    struct_type: 'textinput',
    parameters: {
      group: 'form',
    },
    styles: {},
    name: 'textinput',
    children: [],
  },
  checkbox: {
    buoyancy: 0,
    func_type: 'checkbox',
    struct_type: 'checkbox',
    parameters: {
      group: 'form',
      defaultChecked: true,
    },
    styles: {},
    name: 'checkbox',
    children: [],
  },
  radiobutton: {
    buoyancy: 0,
    func_type: 'radiobutton',
    struct_type: 'radiobutton',
    parameters: {
      group: 'form',
    },
    styles: {},
    name: 'radiobutton',
    children: [],
  },
  select: {
    buoyancy: 0,
    func_type: 'select',
    struct_type: 'select',
    parameters: {
      group: 'form',
    },
    styles: {},
    name: 'select',
    children: [
      {
        buoyancy: 0,
        func_type: 'menu',
        struct_type: 'menu',
        parameters: {},
        styles: {},
        name: 'menu',
        children: [],
      },
      {
        buoyancy: 0,
        func_type: 'menuItem',
        struct_type: 'menuItem',
        parameters: {},
        styles: {},
        name: 'menuItem',
        children: [],
      },
    ],
  },
  ocrtext: {
    buoyancy: 100,
    func_type: 'ocrtext',
    struct_type: 'ocrtext',
    parameters: {
      group: 'other',
    },
    styles: {},
    name: 'ocrtext',
    children: [],
  },
  map: {
    buoyancy: 0,
    func_type: 'map',
    struct_type: 'map',
    parameters: {
      group: 'widget',
    },
    styles: {},
    name: 'map',
    children: [],
  },
  calendar: {
    buoyancy: 0,
    func_type: 'calendar',
    struct_type: 'calendar',
    parameters: {
      group: 'widget',
    },
    styles: {},
    name: 'calendar',
    children: [],
  },
  clock: {
    buoyancy: 0,
    func_type: 'clock',
    struct_type: 'clock',
    parameters: {
      group: 'widget',
    },
    styles: {},
    name: 'clock',
    children: [],
  },
  undefined: {
    buoyancy: 0,
    func_type: 'undefined',
    struct_type: 'undefined',
    parameters: {
      group: 'undefined',
    },
    styles: {},
    name: 'undefined',
    children: [],
  },
};
