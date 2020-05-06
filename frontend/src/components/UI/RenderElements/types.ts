import { SelectChild, ListItemChild, DropdownChild } from "$domain/libraryElements";
import { IMapProps, HeadingType, InputType, LinkParams } from "$redux/project/types";

type SharedRendererProps = {
  id: string;
  style: React.CSSProperties,
  active: boolean,
  isDisabled: boolean,
};


export type SharedElementRendererProps = SharedRendererProps & {
  sortableId: string,
  activeItemId: string,
};

export type ImageRendererProps = SharedElementRendererProps & {
  params: {
    imageURL: string,
  },
};

export type MapRendererProps = SharedElementRendererProps & {
  params: {
    map_props: IMapProps,
  },
};

export type ClockRendererProps = SharedElementRendererProps & {
  params: {
    width: string,
    height: string,
  },
};

export type HeadingRendererProps = SharedElementRendererProps & {
  params: {
    headingType: HeadingType,
    textContent: string,
  },
};

export type ParagraphRendererProps = SharedElementRendererProps & {
  params: {
    textContent: string,
  },
};

export type LabelRendererProps = SharedElementRendererProps & {
  params: {
    labelFor: string,
    textContent: string,
  },
};

export type TextBlockRendererProps = SharedElementRendererProps & {
  params: {
    textContent: string,
  },
};

export type DropdownRendererProps = SharedElementRendererProps & {
  params: {
    textContent: string,
    dropdownItems: [],
    showRipple: boolean,
  },
  childrenElements: DropdownChild[],
};

export type ActionRendererProps = SharedElementRendererProps & {
  params: {
    action: LinkParams,
    textContent: string,
    showRipple: boolean,
  },
  onClick?(event: any): void,
};

export type CheckboxRendererProps = SharedElementRendererProps & {
  params: {
    value: string,
    name: string,
    showRipple: boolean,
  },
  isCheckboxChecked: boolean,
  onChange(itemID: string, savedValue: boolean): void,
};

export type InputRendererProps = SharedElementRendererProps & {
  params: {
    type: InputType,
    placeholder: string,
  },
  value: string,
  onChange(itemID: string, savedValue: string): void,
};

export type TextareaRendererProps = SharedElementRendererProps & {
  params: {
    placeholder: string,
  },
  value: string,
  onChange(itemID: string, savedValue: string): void,
};

export type RadioRendererProps = SharedElementRendererProps & {
  params: {
    value: string,
    name: string,
    showRipple: boolean,
  },
  isRadioChecked: boolean,
  onChange(itemID: string, savedValue: string): void,
};

export type SelectRendererProps = SharedElementRendererProps & {
  params: {
    showRipple: boolean,
    isOpen: boolean,
    options: [],
  },
  value: string,
  childrenElements: SelectChild[],
  onChange(itemID: string, savedValue: string): void,
};

export type ListRendererProps = SharedElementRendererProps & {
  params: {
    isOrdered: boolean,
    listItems: [],
  },
  childrenElements: ListItemChild[],
};

export type ListItemRendererProps = SharedRendererProps & {
  params: {
    textContent: string,
    isLink: boolean,
    link: string,
  },
};

