import { Entity } from '$domain/core';
import { CssLikeStyles } from '$utils/StyleHelper';

export type ImageParameters = {
  image: string,
};

export type InternalLink = { type: 'internal-link', screenID: number | 'noScreen' };
export type ExternalLink = { type: 'external-link', url: string };

export type LinkParams = InternalLink | ExternalLink;

export type ButtonParameters = {
  textContent: string,
  action: { action: LinkParams },
  showRipple: boolean,
};

export type HyperLinkParameters = {
  textContent: string,
  action: { action: LinkParams },
};

export type InputType = 'text' | 'email' | 'number' | 'phone' | 'password';

export type TextinputParameters = {
  type: InputType,
  textContent: string,
  placeholder: string,
};

export type CheckboxParameters = {
  value: string,
  name: string,
  showRipple: boolean,
  defaultChecked: boolean,
};

export type RadiobuttonParameters = {
  value: string,
  name: string,
  showRipple: boolean,
};

export type Option = { name: string; value: any };

export type SelectParameters = {
  value: string,
  options: Option[],
  isOpen: boolean,
};

export type SelectItemParameters = {
  name: string,
  value: string,
};

export type TextareaParameters = {
  textContent: string,
  placeholder: string,
};

export type HeadingType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export type HeadingParameters = {
  textContent: string,
  headingType: HeadingType,
};

export type ParagraphParameters = {
  textContent: string,
};

export type OcrtextParameters = {
  textContent: string,
};

export type LabelParameters = {
  textContent: string,
  for: string,
};

export type TextBlockParameters = {
  textContent: string,
};

export type ListItem = {
  textContent: string,
  isLink: boolean,
  link: string,
};

export type ListParameters = {
  listItems: ListItem[],
  isOrdered: boolean,
};

export type ListItemParameters = {
  textContent: string,
  isLink: boolean,
  link: string,
};

type MapProps = {
  map_props: {
    center: {
      lat: number,
      lng: number,
    },
    zoom: number,
    markerText: string,
  },
};

export type MapParameters = {
  mapProps: MapProps,
};

export type VideoSettings = {
  link: string,
  autoplay: boolean,
  start: number,
  end: number,
  loop: boolean,
  rel: boolean,
};

export type VideoParameters = {
  videoSettings: VideoSettings,
};

export type DropdownParameters = {
  textContent: string,
  showRipple: boolean,
  isOpen: boolean,
  dropdownItems: string[],
};

export type DropdownItemParameters = {
  textContent: string,
};

export type ServerElement =
| ContainerServerElement
| ImageServerElement
| ButtonServerElement
| HyperlinkServerElement
| TextinputServerElement
| CheckboxServerElement
| RadiobuttonServerElement
| SelectServerElement
| SelectMenuServerElement
| SelectItemServerElement
| TextareaServerElement
| HeadingServerElement
| ParagraphServerElement
| OcrtextServerElement
| LabelServerElement
| TextBlockServerElement
| ListServerElement
| ListItemServerElement
| MapServerElement
| CalendarServerElement
| ClockServerElement
| VideoServerElement
| DropdownServerElement
| UndefinedServerElement;

export type CommonServerElement<Type extends Entity> = {
  id?: number,
  name: string,
  scenario?: number,
  struct_type: Type,
  func_type: string,
  buoyancy: number,
  image?: string | null,
  parameters: { group?: string },
  styles: {},
};

export type RootServerElement = CommonServerElement<'root'> & {
  children: ServerElement[],
};

export type ContainerServerElement = CommonServerElement<'container'> & {
  children: ServerElement[],
};

export type ImageServerElement = CommonServerElement<'image'> & {
  children: [],
  parameters: ImageParameters,
};

export type ButtonServerElement = CommonServerElement<'button'> & {
  children: [],
  parameters: ButtonParameters,
};

export type HyperlinkServerElement = CommonServerElement<'hyperlink'> & {
  children: [],
  parameters: HyperLinkParameters,
};

export type TextinputServerElement = CommonServerElement<'textinput'> & {
  children: [],
  parameters: TextinputParameters,
};

export type CheckboxServerElement = CommonServerElement<'checkbox'> & {
  children: [],
  parameters: CheckboxParameters,
};

export type RadiobuttonServerElement = CommonServerElement<'radiobutton'> & {
  children: [],
  parameters: RadiobuttonParameters,
};

export type SelectServerElement = CommonServerElement<'select'> & {
  children: SelectMenuServerElement[],
  parameters: SelectParameters,
};

export type SelectMenuServerElement = CommonServerElement<'selectMenu'> & {
  children: SelectItemServerElement[],
  parameters: {},
};

export type SelectItemServerElement = CommonServerElement<'selectItem'> & {
  children: [],
  parameters: SelectItemParameters,
};

export type TextareaServerElement = CommonServerElement<'textarea'> & {
  children: [],
  parameters: TextareaParameters,
};

export type HeadingServerElement = CommonServerElement<'heading'> & {
  children: [],
  parameters: HeadingParameters,
};

export type ParagraphServerElement = CommonServerElement<'paragraph'> & {
  children: [],
  parameters: ParagraphParameters,
};

export type OcrtextServerElement = CommonServerElement<'ocrtext'> & {
  children: [],
  parameters: OcrtextParameters,
};

export type LabelServerElement = CommonServerElement<'label'> & {
  children: [],
  parameters: LabelParameters,
};

export type TextBlockServerElement = CommonServerElement<'text_block'> & {
  children: [],
  parameters: TextBlockParameters,
};

export type ListServerElement = CommonServerElement<'list'> & {
  children: ListItemServerElement[],
  parameters: ListParameters,
};

export type ListItemServerElement = CommonServerElement<'listItem'> & {
  children: [],
  parameters: ListItemParameters,
};

export type MapServerElement = CommonServerElement<'map'> & {
  children: [],
  parameters: MapParameters,
};

export type CalendarServerElement = CommonServerElement<'calendar'> & {
  children: [],
  parameters: {},
};

export type ClockServerElement = CommonServerElement<'clock'> & {
  children: [],
  parameters: {},
};

export type VideoServerElement = CommonServerElement<'video'> & {
  children: [],
  parameters: VideoParameters,
};

export type DropdownServerElement = CommonServerElement<'dropdown'> & {
  children: DropdownMenuServerElement[],
  parameters: DropdownParameters,
};

export type DropdownMenuServerElement = CommonServerElement<'dropdownMenu'> & {
  children: DropdownItemServerElement[],
  parameters: {},
};

export type DropdownItemServerElement = CommonServerElement<'dropdownItem'> & {
  children: [],
  parameters: DropdownItemParameters,
};

export type UndefinedServerElement = CommonServerElement<'undefined'> & {
  children: [],
  parameters: {},
};

export type ServerRecursiveElement = {
  id: number,
  name: string,
  children: [],
};

export type RecursiveElement = {
  id: string,
  name: string,
  children: [],
}

type CommonElement<Type extends Entity> = {
  id: string,
  name: string,
  type: Type,
  buoyancy: number,
  image: string | null | undefined,
  styles: CssLikeStyles,
};

export type RootElement = CommonElement<'root'> & {
  children: LibraryElement[],
  parameters: {},
};

export type ContainerElement = CommonElement<'container'> & {
  children: LibraryElement[],
  parameters: {},
};

export type ImageElement = CommonElement<'image'> & {
  children: [],
  parameters: ImageParameters,
};

export type ButtonElement = CommonElement<'button'> & {
  children: [],
  parameters: ButtonParameters,
};

export type HyperlinkElement = CommonElement<'hyperlink'> & {
  children: [],
  parameters: HyperLinkParameters,
};

export type TextinputElement = CommonElement<'textinput'> & {
  children: [],
  parameters: TextinputParameters,
};

export type CheckboxElement = CommonElement<'checkbox'> & {
  children: [],
  parameters: CheckboxParameters,
};

export type RadiobuttonElement = CommonElement<'radiobutton'> & {
  children: [],
  parameters: RadiobuttonParameters,
};

export type SelectElement = CommonElement<'select'> & {
  children: SelectMenuElement[],
  parameters: SelectParameters,
};

export type SelectMenuElement = CommonElement<'selectMenu'> & {
  children: SelectItemElement[],
  parameters: {},
};

export type SelectItemElement = CommonElement<'selectItem'> & {
  children: [],
  parameters: SelectItemParameters,
};

export type TextareaElement = CommonElement<'textarea'> & {
  children: [],
  parameters: TextareaParameters,
};

export type HeadingElement = CommonElement<'heading'> & {
  children: [],
  parameters: HeadingParameters,
};

export type ParagraphElement = CommonElement<'paragraph'> & {
  children: [],
  parameters: ParagraphParameters,
};

export type OcrtextElement = CommonElement<'ocrtext'> & {
  children: [],
  parameters: OcrtextParameters,
};

export type LabelElement = CommonElement<'label'> & {
  children: [],
  parameters: LabelParameters,
};

export type TextBlockElement = CommonElement<'text_block'> & {
  children: [],
  parameters: TextBlockParameters,
};

export type ListElement = CommonElement<'list'> & {
  children: ListItemElement[],
  parameters: ListParameters,
};

export type ListItemElement = CommonElement<'listItem'> & {
  children: [],
  parameters: ListItemParameters,
};

export type MapElement = CommonElement<'map'> & {
  children: [],
  parameters: MapParameters,
};

export type CalendarElement = CommonElement<'calendar'> & {
  children: [],
  parameters: {},
};

export type ClockElement = CommonElement<'clock'> & {
  children: [],
  parameters: {},
};

export type VideoElement = CommonElement<'video'> & {
  children: [],
  parameters: VideoParameters,
};

export type DropdownElement = CommonElement<'dropdown'> & {
  children: DropdownMenuElement[],
  parameters: DropdownParameters,
};

export type DropdownMenuElement = CommonElement<'dropdownMenu'> & {
  children: DropdownItemElement[],
  parameters: {},
};

export type DropdownItemElement = CommonElement<'dropdownItem'> & {
  children: [],
  parameters: DropdownItemParameters,
};

export type UndefinedElement = CommonElement<'undefined'> & {
  children: [],
  parameters: {},
};

export type LibraryElement =
  | RootElement
  | ContainerElement
  | ImageElement
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
  | UndefinedElement;
