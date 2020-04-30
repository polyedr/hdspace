import { SelectChild, ListItemChild, DropdownChild } from "$domain/libraryElements";
import { IMapProps, HeadingType, InputType, LinkParams } from "$redux/project/types";

export type SharedRendererProps = {
  id: string;
  style: React.CSSProperties,
  sortableId: string,
  active: boolean,
  isDisabled: boolean,
};

type ImageRendererProps = {
  params: {
    imageURL: string,
  },
};

type MapRendererProps = {
  params: {
    map_props: IMapProps,
  },
};

type ClockRendererProps = {
  params: {
    width: string,
    height: string,
  },
};

export type HeadingRendererProps = {
  params: {
    headingType: HeadingType,
    textContent: string,
  },
};

export type ParagraphRendererProps = {
  params: {
    textContent: string,
  },
};

export type LabelRendererProps = {
  params: {
    labelFor: string,
    textContent: string,
  },
};

export type TextBlockRendererProps = {
  params: {
    textContent: string,
  },
};

export type DropdownRendererProps = {
  params: {
    textContent: string,
    dropdownItems: [],
    showRipple: boolean,
  },
  childrenElements: DropdownChild[],
};

export type ActionRendererProps = {
  params: {
    action: LinkParams,
    textContent: string,
    showRipple: boolean,
  },
  onClick?(event: any): void,
};

export type CheckboxRendererProps = {
  params: {
    value: string,
    name: string,
    showRipple: boolean,
  },
  isCheckboxChecked: boolean,
  onChange(itemID: string, savedValue: boolean): void,
};

export type InputRendererProps = {
  params: {
    type: InputType,
    placeholder: string,
  },
  value: string,
  onChange(itemID: string, savedValue: string): void,
};

export type TextareaRendererProps = {
  params: {
    placeholder: string,
  },
  value: string,
  onChange(itemID: string, savedValue: string): void,
};

export type RadioRendererProps = {
  params: {
    value: string,
    name: string,
    showRipple: boolean,
  },
  isRadioChecked: boolean,
  onChange(itemID: string, savedValue: string): void,
};

export type SelectRendererProps = {
  params: {
    showRipple: boolean,
    isOpen: boolean,
    options: [],
  },
  selectValue: string,
  childrenElements: SelectChild[],
  onChange(itemID: string, savedValue: string): void,
};

export type ListRendererProps = {
  params: {
    isOrdered: boolean,
    listItems: [],
  },
  childrenElements: ListItemChild[],
};

export type ClockProps = SharedRendererProps & ClockRendererProps;
export type MapProps = SharedRendererProps & MapRendererProps;
export type ImageProps = SharedRendererProps & ImageRendererProps;
