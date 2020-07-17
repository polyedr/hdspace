import { IMapProps } from "$redux/project/types";
import { LibraryElement, HeadingType, LinkParams, VideoSettings, InputType } from "$api/types";

export type SharedRendererProps = {
  id: string;
  style: React.CSSProperties,
  active: boolean,
  sortableId: string,
  isDisabled: boolean,
  className?: string,
  elementRef: ((element: any) => void) | null,
  children: React.ReactElement[],
};

export type ContainerRendererProps = SharedRendererProps & {
  isBorderVisible: boolean,
  showBorders: boolean,
};

export type DivBlockRendererProps = SharedRendererProps;

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
    textContent: string;
    showRipple: boolean;
    isOpen: boolean;
  };
};

export type DropdownMenuRendererProps = SharedRendererProps & {
  params: {},
  anchorEl: HTMLElement | null,
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>,
};

export type DropdownItemRendererProps = SharedRendererProps & {
  params: {
    textContent: string,
    showRipple: boolean,
  },
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
  currentValue: string,
  params: {
    name: string,
    showRipple: boolean,
  },
  isCheckboxChecked: boolean,
  onElementChange(itemID: string, savedValue: boolean): void,
};

export type InputRendererProps = SharedRendererProps & {
  params: {
    type: InputType,
    placeholder: string,
  },
  currentValue: string,
  onElementChange(itemID: string, savedValue: string): void,
};

export type TextareaRendererProps = SharedRendererProps & {
  params: {
    placeholder: string,
  },
  currentValue: string,
  onElementChange(itemID: string, savedValue: string): void,
};

export type RadioRendererProps = SharedRendererProps & {
  params: {
    value: string,
    name: string,
    showRipple: boolean,
  },
  currentValue: string,
  isRadioChecked: boolean,
  onElementChange(itemID: string, savedValue: string): void,
};

export type SelectRendererProps = SharedRendererProps & {
  params: {
    isOpen: boolean,
  },
  currentValue: string,
  childrenElements: LibraryElement<'selectMenu'>[],
  onElementChange(itemID: string, savedValue: string): void,
};

export type SelectMenuRendererProps = SharedRendererProps;

export type MenuItemRendererProps = SharedRendererProps & {
  params: {
    name: string,
    value: string,
    showRipple: boolean,
  },
};

export type ListRendererProps = SharedRendererProps & {
  params: {
    isOrdered: boolean,
  },
};

export type VideoRendererProps = SharedRendererProps & {
  params: { videoSettings: VideoSettings },
};

export type ListItemRendererProps = Omit<SharedRendererProps, 'sortableId' | 'activeItemId'> & {
  params: {
    textContent: string,
    isLink: boolean,
    link: string,
  },
};
