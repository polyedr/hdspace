import { CSSProperties } from 'react';

import { ServerStructType } from '$redux/project/types';

import { Entity } from './core';

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

export type LibraryElements = Record<Exclude<Entity, 'root' | 'container'>, LibraryElement>;

// WARN: every time you add or remove some LibraryElements in prod, you must write migration in db
export const LIBRARY_ELEMENTS: LibraryElements = {
  image: {
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
  },
  button: {
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
  },
  hyperlink: {
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
    }
  },
  textinput: {
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
  },
  checkbox: {
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
  },
  radiobutton: {
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
  },
  select: {
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
  },
  ocrtext: {
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
  },
  map: {
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
  },
  calendar: {
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
  },
  clock: {
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
  },
  undefined: {
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
  },
};
