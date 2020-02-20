import { ServerFuncType } from "$redux/project/types";
import { Entity } from "./core";
import { CSSProperties } from "react";

export type LibraryElementType = {
  buoyancy: number,
  func_type: ServerFuncType,
  struct_type: Entity,
  parameters: any,
  styles: CSSProperties,
  name: Entity,
}

export type LibraryElement = Partial<Record<ServerFuncType, LibraryElementType>>;

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
      styles: {
        width: '80px',
        height: '80px',
      },
      name: 'image',
    },
  },
  button: {
    end_composite_scenario: {
      buoyancy: 1,
      func_type: 'end_composite_scenario',
      struct_type: 'button',
      parameters: {
        group: 'button',
      },
      styles: {
        width: '64px',
        height: '36px',
      },
      name: 'button',
    },
    end_simple_scenario: {
      buoyancy: 0,
      func_type: 'end_simple_scenario',
      struct_type: 'button',
      parameters: {
        group: 'button',
      },
      styles: {},
      name: 'button',
    }
  },
  hyperlink: {
    end_simple_scenario: {
      buoyancy: 2,
      func_type: 'end_simple_scenario',
      struct_type: 'hyperlink',
      parameters: {
        group: 'other',
      },
      styles: {
        width: '50px',
        height: '25px',
      },
      name: 'hyperlink',
    }
  },
  textinput: {
    email: {
      buoyancy: 95,
      func_type: 'email',
      struct_type: 'textinput',
      parameters: {
        group: 'input',
        placeholder: 'Email',
      },
      styles: {
        width: '280px',
        height: '56px',
      },
      name: 'textinput',
    },
    phone: {
      buoyancy: 86,
      func_type: 'phone',
      struct_type: 'textinput',
      parameters: {
        group: 'input',
        placeholder: 'Phone',
      },
      styles: {
        width: '280px',
        height: '56px',
      },
      name: 'textinput',
    },
    username: {
      buoyancy: 65,
      func_type: 'username',
      struct_type: 'textinput',
      parameters: {
        group: 'input',
        placeholder: 'Username',
      },
      styles: {
        width: '280px',
        height: '56px',
      },
      name: 'textinput',
    },
    firstname: {
      buoyancy: 64,
      func_type: 'firstname',
      struct_type: 'textinput',
      parameters: {
        group: 'input',
        placeholder: 'First name',
        tags: '#username_horizontal',
      },
      styles: {
        width: '280px',
        height: '56px',
      },
      name: 'textinput',
    },
    lastname: {
      buoyancy: 61,
      func_type: 'lastname',
      struct_type: 'textinput',
      parameters: {
        group: 'input',
        placeholder: 'Last name',
        tags: '#username_horizontal',
      },
      styles: {
        width: '280px',
        height: '56px',
      },
      name: 'textinput',
    },
    password: {
      buoyancy: 10,
      func_type: 'password',
      struct_type: 'textinput',
      parameters: {
        group: 'input',
        placeholder: 'Password',
      },
      styles: {
        width: '280px',
        height: '56px',
      },
      name: 'textinput',
    },
  },
  ocrtext: {
    title: {
      buoyancy: 100,
      func_type: 'title',
      struct_type: 'ocrtext',
      parameters: {
        group: 'other',
      },
      styles: {
        width: '100px',
        height: '40px',
      },
      name: 'ocrtext',
    },
    description: {
      buoyancy: 98,
      func_type: 'description',
      struct_type: 'ocrtext',
      parameters: {
        group: 'other',
      },
      styles: {
        width: '100px',
        height: '40px',
      },
      name: 'ocrtext',
    },
    label: {
      buoyancy: 0,
      func_type: 'label',
      struct_type: 'ocrtext',
      parameters: {
        group: 'other',
      },
      styles: {
        width: '100px',
        height: '40px',
      },
      name: 'ocrtext',
    },
  },
  select: {
    day: {
      buoyancy: 54,
      func_type: 'day',
      struct_type: 'select',
      parameters: {
        group: 'select',
        tags: '#date_horizontal',
      },
      styles: {
        width: '50px',
        height: '25px',
      },
      name: 'select',
    },
    month: {
      buoyancy: 54,
      func_type: 'month',
      struct_type: 'select',
      parameters: {
        group: 'select',
        tags: '#date_horizontal',
      },
      styles: {
        width: '50px',
        height: '25px',
      },
      name: 'select',
    },
    year: {
      buoyancy: 54,
      func_type: 'year',
      struct_type: 'select',
      parameters: {
        group: 'select',
        tags: '#date_horizontal',
      },
      styles: {
        width: '50px',
        height: '25px',
      },
      name: 'select',
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
      styles: {
        width: '500px',
        height: '250px',
      },
      name: 'map',
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
      styles: {
        width: '350px',
        height: '300px',
      },
      name: 'calendar',
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
      styles: {
        width: '150px',
        height: '150px',
      },
      name: 'clock',
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
    },
  },
};
