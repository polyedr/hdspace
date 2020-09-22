/* eslint-disable camelcase */

import {
  ImageParameters,
  ButtonParameters,
  HyperLinkParameters,
  TextinputParameters,
  CheckboxParameters,
  RadiobuttonParameters,
  SelectParameters,
  SelectItemParameters,
  TextareaParameters,
  HeadingParameters,
  ParagraphParameters,
  OcrtextParameters,
  LabelParameters,
  TextBlockParameters,
  ListParameters,
  ListItemParameters,
  MapParameters,
  VideoParameters,
  DropdownParameters,
  DropdownItemParameters,
  ScreenshotParameters,
} from './elementsParameters';
import { Entity } from '../../domain/core';

export type ServerElement<
  Type extends Entity,
  Children = any[],
  Params = {},
  Styles = {}
> = {
  id?: number;
  name: string;
  scenario?: number;
  struct_type: Type;
  func_type: string;
  buoyancy: number;
  image?: string | null;
  parameters: { group?: string } & Params;
  custom?: boolean;
  // Every element has entity css class, group css class and unique own css class
  // Entity class has default entity styles, own class is empty by default, group classes is user custom classes
  styles: {
    classNames: string[];
    ownStyles: Styles;
  };
  children: Children;
};

export type RootServerElement = ServerElement<'root', []>;
export type SectionServerElement = ServerElement<
  'section',
  ServerElement<Entity>[]
>;
export type ContainerServerElement = ServerElement<
  'container',
  ServerElement<Entity>[]
>;
export type DivBlockServerElement = ServerElement<'divBlock'>;
export type PageTemplateServerElement = ServerElement<
  'pageTemplate' | 'emptyPageTemplate',
  ContainerServerElement[]
>;
export type GridServerElement = ServerElement<'grid', ContainerServerElement[]>;
export type ColumnsServerElement = ServerElement<
  'columns',
  ContainerServerElement[]
>;
export type SubscribeFormServerElement = ServerElement<
  'subscribeForm',
  ServerElement<Entity>[]
>;
export type CardsSectionServerElement = ServerElement<
  'cardsSection',
  ServerElement<Entity>[]
>;
export type FeatureSectionServerElement = ServerElement<
  'featureSection',
  ServerElement<Entity>[]
>;
export type ImageServerElement = ServerElement<'image', [], ImageParameters>;
export type ScreenshotServerElement = ServerElement<
  'screenshot',
  [],
  ScreenshotParameters
>;
export type ButtonServerElement = ServerElement<'button', [], ButtonParameters>;
export type HyperlinkServerElement = ServerElement<
  'hyperlink',
  [],
  HyperLinkParameters
>;
export type TextinputServerElement = ServerElement<
  'textinput',
  [],
  TextinputParameters
>;
export type CheckboxServerElement = ServerElement<
  'checkbox',
  [],
  CheckboxParameters
>;
export type RadiobuttonServerElement = ServerElement<
  'radiobutton',
  [],
  RadiobuttonParameters
>;
export type SelectServerElement = ServerElement<
  'select',
  SelectMenuServerElement[],
  SelectParameters
>;
export type SelectMenuServerElement = ServerElement<
  'selectMenu',
  SelectItemServerElement[]
>;
export type SelectItemServerElement = ServerElement<
  'selectItem',
  [],
  SelectItemParameters
>;
export type TextareaServerElement = ServerElement<
  'textarea',
  [],
  TextareaParameters
>;
export type HeadingServerElement = ServerElement<
  'heading',
  [],
  HeadingParameters
>;
export type ParagraphServerElement = ServerElement<
  'paragraph',
  [],
  ParagraphParameters
>;
export type OcrtextServerElement = ServerElement<
  'ocrtext',
  [],
  OcrtextParameters
>;
export type LabelServerElement = ServerElement<'label', [], LabelParameters>;
export type TextBlockServerElement = ServerElement<
  'textBlock',
  [],
  TextBlockParameters
>;
export type ListServerElement = ServerElement<
  'list',
  ListItemServerElement[],
  ListParameters
>;
export type ListItemServerElement = ServerElement<
  'listItem',
  [],
  ListItemParameters
>;
export type MapServerElement = ServerElement<'map', [], MapParameters>;
export type CalendarServerElement = ServerElement<'calendar', []>;
export type ClockServerElement = ServerElement<'clock', []>;
export type VideoServerElement = ServerElement<'video', [], VideoParameters>;
export type DropdownServerElement = ServerElement<
  'dropdown',
  DropdownMenuServerElement[],
  DropdownParameters
>;
export type DropdownMenuServerElement = ServerElement<
  'dropdownMenu',
  DropdownItemServerElement[]
>;
export type DropdownItemServerElement = ServerElement<
  'dropdownItem',
  [],
  DropdownItemParameters
>;
export type UndefinedServerElement = ServerElement<'undefined', []>;

export type ServerRecursiveElement = {
  id: number;
  name: string;
  children: [];
};

export type RecursiveElement = {
  id: string;
  name: string;
  children: [];
};

export type LibraryElement<
  Type extends Entity,
  Children = any[],
  Params = any,
  Styles = {}
> = {
  id: string;
  name: string;
  type: Type;
  buoyancy: number;
  image: string | null | undefined;
  styles: {
    classNames: string[];
    ownStyles: Styles;
  };
  children: Children;
  parameters: { group?: string } & Params;
};

export type RootElement = LibraryElement<'root', []>;
export type ContainerElement = LibraryElement<'container', []>;
export type DivBlockElement = LibraryElement<'divBlock'>;
export type PageTemplateElement = LibraryElement<
  'pageTemplate',
  ContainerElement[]
>;
export type SubscribeFormElement = LibraryElement<
  'subscribeForm',
  LibraryElement<Entity>[]
>;
export type CardsSectionElement = LibraryElement<
  'cardsSection',
  LibraryElement<Entity>
>;
export type ImageElement = LibraryElement<'image', [], ImageParameters>;
export type ScreenshotElement = LibraryElement<
  'screenshot',
  [],
  ScreenshotParameters
>;
export type ButtonElement = LibraryElement<'button', [], ButtonParameters>;
export type HyperlinkElement = LibraryElement<
  'hyperlink',
  [],
  HyperLinkParameters
>;
export type TextinputElement = LibraryElement<
  'textinput',
  [],
  TextinputParameters
>;
export type CheckboxElement = LibraryElement<
  'checkbox',
  [],
  CheckboxParameters
>;
export type RadiobuttonElement = LibraryElement<
  'radiobutton',
  [],
  RadiobuttonParameters
>;
export type SelectElement = LibraryElement<
  'select',
  SelectMenuElement[],
  SelectParameters
>;
export type SelectMenuElement = LibraryElement<
  'selectMenu',
  SelectItemElement[]
>;
export type SelectItemElement = LibraryElement<
  'selectItem',
  [],
  SelectItemParameters
>;
export type TextareaElement = LibraryElement<
  'textarea',
  [],
  TextareaParameters
>;
export type HeadingElement = LibraryElement<'heading', [], HeadingParameters>;
export type ParagraphElement = LibraryElement<
  'paragraph',
  [],
  ParagraphParameters
>;
export type OcrtextElement = LibraryElement<'ocrtext', [], OcrtextParameters>;
export type LabelElement = LibraryElement<'label', [], LabelParameters>;
export type TextBlockElement = LibraryElement<
  'textBlock',
  [],
  TextBlockParameters
>;
export type ListElement = LibraryElement<
  'list',
  ListItemElement[],
  ListParameters
>;
export type ListItemElement = LibraryElement<
  'listItem',
  [],
  ListItemParameters
>;
export type MapElement = LibraryElement<'map', [], MapParameters>;
export type CalendarElement = LibraryElement<'calendar', []>;
export type ClockElement = LibraryElement<'clock', []>;
export type VideoElement = LibraryElement<'video', [], VideoParameters>;
export type DropdownElement = LibraryElement<
  'dropdown',
  DropdownMenuElement[],
  DropdownParameters
>;
export type DropdownMenuElement = LibraryElement<
  'dropdownMenu',
  DropdownItemElement[]
>;
export type DropdownItemElement = LibraryElement<
  'dropdownItem',
  [],
  DropdownItemParameters
>;
export type UndefinedElement = LibraryElement<'undefined', []>;

export type FeatureSectionElement = LibraryElement<
  'featureSection',
  LibraryElement<Entity>[]
>;

export type LibraryElementUnion =
  | RootElement
  | ContainerElement
  | DivBlockElement
  | ImageElement
  | ScreenshotElement
  | ButtonElement
  | HyperlinkElement
  | TextinputElement
  | CheckboxElement
  | RadiobuttonElement
  | SelectElement
  | SelectMenuElement
  | SelectItemElement
  | TextareaElement
  | HeadingElement
  | ParagraphElement
  | OcrtextElement
  | LabelElement
  | TextBlockElement
  | ListElement
  | ListItemElement
  | MapElement
  | CalendarElement
  | ClockElement
  | VideoElement
  | DropdownElement
  | DropdownMenuElement
  | DropdownItemElement
  | PageTemplateElement
  | UndefinedElement
  | SubscribeFormElement
  | FeatureSectionElement;
