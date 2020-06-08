import { ServerStructType } from '$redux/project/types';
import { CssLikeStyles } from '$utils/StyleHelper';

type CommonLibraryElement<Type extends ServerStructType, ChildrenType=[]> = {
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

export type SelectItemChild = Omit<CommonLibraryElement<'selectItem'>, 'parameters'> & {
  id: number,
  parameters: {
    name: string,
    value: string,
  }
};

export type SelectMenuChild = Omit<CommonLibraryElement<'selectMenu'>, 'parameters'> & { id: number };

export type DropdownItemChild = Omit<CommonLibraryElement<'dropdownItem'>, 'parameters'> & {
  id: number,
  parameters: {
    textContent: string,
  }
};

export type DropdownMenuChild = Omit<CommonLibraryElement<'selectMenu'>, 'parameters'> & { id: number };

export type ListItemChild = Omit<CommonLibraryElement<'listItem'>, 'parameters'> & {
  id: number,
  parameters: {
    textContent: string,
    isLink: boolean,
    link: string,
  }
};

type LibraryDropdownMenuChild = Omit<CommonLibraryElement<'dropdownMenu'>, 'parameters'> & { parameters: {} };
type LibraryDropdownItemChild = Omit<CommonLibraryElement<'dropdownItem'>, 'parameters'> & { parameters: DropdownItemChild['parameters'] };
type LibrarySelectMenuChild = Omit<CommonLibraryElement<'selectMenu'>, 'parameters'> & { parameters: {} };
type LibrarySelectItemChild = Omit<CommonLibraryElement<'selectItem'>, 'parameters'> & { parameters: SelectItemChild['parameters'] };
type LibraryListItemChild = Omit<CommonLibraryElement<'listItem'>, 'parameters'> & { parameters: ListItemChild['parameters'] };

export type SelectChild = LibrarySelectMenuChild | LibrarySelectItemChild;
export type DropdownChild = LibraryDropdownMenuChild | LibraryDropdownItemChild;

export type ElementChild = SelectItemChild | DropdownItemChild | ListItemChild;
export type AllChildren = (SelectChild | DropdownChild | LibraryListItemChild)[];

export type LibraryRootElement = CommonLibraryElement<'root'> ;
export type LibraryContainer = CommonLibraryElement<'container'>;
export type LibraryImageElement = CommonLibraryElement<'image'>;
export type LibraryButtonElement = CommonLibraryElement<'button'>;
export type LibraryHyperlinkElement = CommonLibraryElement<'hyperlink'>;
export type LibraryTextinputElement = CommonLibraryElement<'textinput'>;
export type LibraryCheckboxElement = CommonLibraryElement<'checkbox'> & { parameters: { defaultChecked: boolean } };
export type LibraryRadiobuttonElement = CommonLibraryElement<'radiobutton'>;
export type LibrarySelectElement = CommonLibraryElement<'select', SelectChild[]>;
export type LibraryTextareaElement = CommonLibraryElement<'textarea'>;
export type LibraryHeadingElement = CommonLibraryElement<'heading'>;
export type LibraryParagraphElement = CommonLibraryElement<'paragraph'>;
export type LibraryOcrtextElement = CommonLibraryElement<'ocrtext'>;
export type LibraryLabelElement = CommonLibraryElement<'label'>;
export type LibraryTextBlockElement = CommonLibraryElement<'text_block'>;
export type LibraryListElement = CommonLibraryElement<'list', LibraryListItemChild[]>;
export type LibraryListItemElement = CommonLibraryElement<'listItem'>;
export type LibraryMapElement = CommonLibraryElement<'map'>;
export type LibraryCalendarElement = CommonLibraryElement<'calendar'>;
export type LibraryClockElement = CommonLibraryElement<'clock'>;
export type LibraryVideoElement = CommonLibraryElement<'video'>;
export type LibraryDropdownElement = CommonLibraryElement<'dropdown', DropdownChild[]>;
export type LibraryUndefinedElement = CommonLibraryElement<'undefined'>;

export type LibraryContainers = {
  root: LibraryRootElement,
  container: LibraryRootElement,
};

export type LibraryChildrenElements = {
  selectMenu: LibrarySelectMenuChild,
  selectItem: LibrarySelectItemChild,
  listItem: LibraryListItemElement,
  dropdownMenu: LibraryDropdownMenuChild,
  dropdownItem: LibraryDropdownItemChild,
};

export type ElementsToAdd = {
  image: LibraryImageElement,
  button: LibraryButtonElement,
  hyperlink: LibraryHyperlinkElement,
  textinput: LibraryTextinputElement,
  checkbox: LibraryCheckboxElement,
  radiobutton: LibraryRadiobuttonElement,
  select: LibrarySelectElement,
  label: LibraryLabelElement,
  textarea: LibraryTextareaElement,
  heading: LibraryHeadingElement,
  paragraph: LibraryParagraphElement,
  ocrtext: LibraryOcrtextElement,
  text_block: LibraryTextBlockElement,
  list: LibraryListElement,
  map: LibraryMapElement,
  calendar: LibraryCalendarElement,
  clock: LibraryClockElement,
  dropdown: LibraryDropdownElement,
  video: LibraryVideoElement,
  undefined: LibraryUndefinedElement,
};

export type LibraryElements = {
  [key in keyof LibraryChildrenElements]: Omit<LibraryChildrenElements[key], 'parameters'> & { parameters: {}};
} & ElementsToAdd;

export type LibraryEntities = LibraryContainers & LibraryElements;

// WARN: every time you add or remove some LibraryElements in prod, you must write migration in db
export const LIBRARY_ELEMENTS: LibraryElements = {
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
        func_type: 'selectMenu',
        struct_type: 'selectMenu',
        parameters: {},
        styles: {},
        name: 'selectMenu',
        children: [],
      },
      {
        buoyancy: 0,
        func_type: 'selectItem',
        struct_type: 'selectItem',
        parameters: { name: 'First option', value: 'first option' },
        styles: {},
        name: 'selectItem',
        children: [],
      },
      {
        buoyancy: 0,
        func_type: 'selectItem',
        struct_type: 'selectItem',
        parameters: { name: 'Second option', value: 'second option' },
        styles: {},
        name: 'selectItem',
        children: [],
      },
      {
        buoyancy: 0,
        func_type: 'selectItem',
        struct_type: 'selectItem',
        parameters: { name: 'Third option', value: 'third option' },
        styles: {},
        name: 'selectItem',
        children: [],
      },
    ],
  },
  selectMenu: {
    buoyancy: 0,
    func_type: 'selectMenu',
    struct_type: 'selectMenu',
    parameters: {},
    styles: {},
    name: 'selectMenu',
    children: [],
  },
  selectItem: {
    buoyancy: 0,
    func_type: 'selectItem',
    struct_type: 'selectItem',
    parameters: {},
    styles: {},
    name: 'selectItem',
    children: [],
  },
  label: {
    buoyancy: 0,
    func_type: 'label',
    struct_type: 'label',
    parameters: {
      group: 'typography',
    },
    styles: {},
    name: 'label',
    children: [],
  },
  textarea: {
    buoyancy: 0,
    func_type: 'textarea',
    struct_type: 'textarea',
    parameters: {
      group: 'form',
    },
    styles: {},
    name: 'textarea',
    children: [],
  },
  heading: {
    buoyancy: 0,
    func_type: 'heading',
    struct_type: 'heading',
    parameters: {
      group: 'typography',
    },
    styles: {},
    name: 'heading',
    children: [],
  },
  paragraph: {
    buoyancy: 0,
    func_type: 'paragraph',
    struct_type: 'paragraph',
    parameters: {
      group: 'typography',
    },
    styles: {},
    name: 'paragraph',
    children: [],
  },
  ocrtext: {
    buoyancy: 0,
    func_type: 'ocrtext',
    struct_type: 'ocrtext',
    parameters: {
      group: 'typography',
    },
    styles: {},
    name: 'ocrtext',
    children: [],
  },
  text_block: {
    buoyancy: 0,
    func_type: 'text_block',
    struct_type: 'text_block',
    parameters: {
      group: 'typography',
    },
    styles: {},
    name: 'text_block',
    children: [],
  },
  list: {
    buoyancy: 0,
    func_type: 'list',
    struct_type: 'list',
    parameters: {
      group: 'typography',
    },
    styles: {},
    name: 'list',
    children: [
      {
        buoyancy: 0,
        func_type: 'listItem',
        struct_type: 'listItem',
        parameters: {
          textContent: 'First item', isLink: false, link: '',
        },
        styles: {},
        name: 'listItem',
        children: [],
      },
      {
        buoyancy: 0,
        func_type: 'listItem',
        struct_type: 'listItem',
        parameters: {
          textContent: 'Second item', isLink: false, link: '',
        },
        styles: {},
        name: 'listItem',
        children: [],
      },
      {
        buoyancy: 0,
        func_type: 'listItem',
        struct_type: 'listItem',
        parameters: {
          textContent: 'Third item', isLink: false, link: '',
        },
        styles: {},
        name: 'listItem',
        children: [],
      },
    ],
  },
  listItem: {
    buoyancy: 0,
    func_type: 'listItem',
    struct_type: 'listItem',
    parameters: {
      group: 'none',
    },
    styles: {},
    name: 'listItem',
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
  dropdown: {
    buoyancy: 0,
    func_type: 'dropdown',
    struct_type: 'dropdown',
    parameters: {
      group: 'other',
    },
    styles: {},
    name: 'dropdown',
    children: [
      {
        buoyancy: 0,
        func_type: 'dropdownMenu',
        struct_type: 'dropdownMenu',
        parameters: {},
        styles: {},
        name: 'dropdownMenu',
        children: [],
      },
      {
        buoyancy: 0,
        func_type: 'dropdownItem',
        struct_type: 'dropdownItem',
        parameters: { textContent: 'First option' },
        styles: {},
        name: 'dropdownItem',
        children: [],
      },
      {
        buoyancy: 0,
        func_type: 'dropdownItem',
        struct_type: 'dropdownItem',
        parameters: { textContent: 'Second option' },
        styles: {},
        name: 'dropdownItem',
        children: [],
      },
      {
        buoyancy: 0,
        func_type: 'dropdownItem',
        struct_type: 'dropdownItem',
        parameters: { textContent: 'Third option' },
        styles: {},
        name: 'dropdownItem',
        children: [],
      },
    ],
  },
  dropdownMenu: {
    buoyancy: 0,
    func_type: 'dropdownMenu',
    struct_type: 'dropdownMenu',
    parameters: {},
    styles: {},
    name: 'dropdownMenu',
    children: [],
  },
  dropdownItem: {
    buoyancy: 0,
    func_type: 'dropdownItem',
    struct_type: 'dropdownItem',
    parameters: {},
    styles: {},
    name: 'dropdownItem',
    children: [],
  },
  video: {
    buoyancy: 0,
    func_type: 'video',
    struct_type: 'video',
    parameters: {
      group: 'other',
    },
    styles: {},
    name: 'video',
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
