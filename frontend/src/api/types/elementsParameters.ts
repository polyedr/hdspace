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
  action: LinkParams,
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
  labelFor: string,
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

export type MapProps = {
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
  map_props: {
    center: {
      lat: number,
      lng: number,
    },
    zoom: number,
    markerText: string,
  },
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
