/* eslint-disable camelcase */
import React, { DOMAttributes } from 'react';
import {
  HeadingType,
  HyperLinkParameters,
  IMapProps,
  InputType,
  NNBlockType,
  VideoSettingsType,
} from '@Src/types';

export type SharedRendererProps = {
  id: string;
  active: boolean;
  isDisabled: boolean;
  contentEditable: boolean;
  className: string;
  children: React.ReactElement[];
  ref?: React.RefObject<HTMLElement> | null;
  isBorderVisible?: boolean;
  groupClass: string | null;
  ownStyles: React.CSSProperties;
} & DOMAttributes<HTMLElement>;

export type GridRendererProps = SharedRendererProps;

export type GridItemRendererProps = SharedRendererProps;

export type ElementsGroupRendererProps = SharedRendererProps;

export type ContainerRendererProps = SharedRendererProps & {
  isBorderVisible: boolean;
};

export type DivBlockRendererProps = SharedRendererProps & {
  isBorderVisible: boolean;
};

export type ImageRendererProps = SharedRendererProps & {
  params: {
    imageURL: string;
  };
};

export type ScreenshotRendererProps = SharedRendererProps & {
  params: {
    imageURL: string;
  };
};

export type SmartContainerRendererProps = SharedRendererProps & {
  blockType: NNBlockType;
  imageUrl: string;
  isBorderVisible: boolean;
};

export type SmartContainerRenderProps = SharedRendererProps & {
  params: {
    imageURL: string;
    isBorderVisible: boolean;
  };
};

export type MapRendererProps = SharedRendererProps & {
  params: {
    map_props: IMapProps;
  };
};

export type ClockRendererProps = SharedRendererProps & {
  params: {
    width: string;
    height: string;
  };
};

export type HeadingRendererProps = SharedRendererProps & {
  params: {
    headingType: HeadingType;
    textContent: string;
  };
};

export type ParagraphRendererProps = SharedRendererProps & {
  params: {
    textContent: string;
  };
};

export type LabelRendererProps = SharedRendererProps & {
  params: {
    labelFor: string;
    textContent: string;
  };
};

export type TextBlockRendererProps = SharedRendererProps & {
  params: {
    textContent: string;
  };
};

export type DropdownRendererProps = SharedRendererProps & {
  params: {
    textContent: string;
    showRipple: boolean;
    isOpen: boolean;
  };
};

export type DropdownMenuRendererProps = SharedRendererProps & {
  params: {};
  parentId?: string;
  anchorRef: React.RefObject<HTMLButtonElement>;
};

export type DropdownItemRendererProps = SharedRendererProps & {
  params: {
    textContent: string;
    showRipple: boolean;
  };
};

export type HyperLinkRendererProps = SharedRendererProps & {
  params: HyperLinkParameters;
};

export type CheckboxRendererProps = SharedRendererProps & {
  params: {
    showRipple: boolean;
  };
};

export type InputRendererProps = SharedRendererProps & {
  params: {
    type: InputType;
    placeholder: string;
  };
  currentValue: string;
};

export type TextareaRendererProps = SharedRendererProps & {
  params: {
    placeholder: string;
  };
  currentValue: string;
};

export type RadioRendererProps = SharedRendererProps & {
  params: {
    showRipple: boolean;
  };
};

export type SelectRendererProps = SharedRendererProps & {
  params: {
    isOpen: boolean;
  };
  currentValue: string;
};

export type SelectMenuRendererProps = SharedRendererProps;

export type MenuItemRendererProps = SharedRendererProps & {
  params: {
    name: string;
    value: string;
    showRipple: boolean;
  };
};

export type ListRendererProps = SharedRendererProps & {
  params: {
    isOrdered: boolean;
  };
};

export type VideoRendererProps = SharedRendererProps & {
  params: { videoSettings: VideoSettingsType };
};

export type ListItemRendererProps = Omit<
  SharedRendererProps,
  'activeElementId'
> & {
  params: {
    textContent: string;
    isLink: boolean;
    link: string;
  };
};
