import { SelectChild, ListItemChild, DropdownChild } from "$domain/libraryElements";
import { IMapProps, HeadingType, InputType, LinkParams } from "$redux/project/types";

export type SharedRendererProps = {
  id: string;
  style: React.CSSProperties,
  sortableId: string,
  active: boolean,
  isDisabled: boolean,
};

export type ImageRendererProps = SharedRendererProps & {
  params: {
    imageURL: string,
  },
};

export type MapRendererProps = SharedRendererProps & {
  params: {
    map_props: IMapProps,
  },
};

export type ClockRendererProps = SharedRendererProps & {
  params: {
    width: string,
    height: string,
  },
};

export type HeadingRendererProps = SharedRendererProps & {
  params: {
    headingType: HeadingType,
    textContent: string,
  },
};

export type ParagraphRendererProps = SharedRendererProps & {
  params: {
    textContent: string,
  },
};

export type LabelRendererProps = SharedRendererProps & {
  params: {
    labelFor: string,
    textContent: string,
  },
};

export type TextBlockRendererProps = SharedRendererProps & {
  params: {
    textContent: string,
  },
};

export type DropdownRendererProps = SharedRendererProps & {
  params: {
    textContent: string,
    dropdownItems: [],
    showRipple: boolean,
  },
  childrenElements: DropdownChild[],
};

export type ActionRendererProps = SharedRendererProps & {
  params: {
    action: LinkParams,
    textContent: string,
    showRipple: boolean,
  },
  onClick?(event: any): void,
};

export type CheckboxRendererProps = SharedRendererProps & {
  params: {
    value: string,
    name: string,
    showRipple: boolean,
  },
  isCheckboxChecked: boolean,
  onChange(itemID: string, savedValue: boolean): void,
};

export type InputRendererProps = SharedRendererProps & {
  params: {
    type: InputType,
    placeholder: string,
  },
  value: string,
  onChange(itemID: string, savedValue: string): void,
};

export type TextareaRendererProps = SharedRendererProps & {
  params: {
    placeholder: string,
  },
  value: string,
  onChange(itemID: string, savedValue: string): void,
};

export type RadioRendererProps = SharedRendererProps & {
  params: {
    value: string,
    name: string,
    showRipple: boolean,
  },
  isRadioChecked: boolean,
  onChange(itemID: string, savedValue: string): void,
};

export type SelectRendererProps = SharedRendererProps & {
  params: {
    showRipple: boolean,
    isOpen: boolean,
    options: [],
  },
  selectValue: string,
  childrenElements: SelectChild[],
  onChange(itemID: string, savedValue: string): void,
};

export type ListRendererProps = SharedRendererProps & {
  params: {
    isOrdered: boolean,
    listItems: [],
  },
  childrenElements: ListItemChild[],
};

