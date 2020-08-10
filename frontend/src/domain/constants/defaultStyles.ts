import { CssLikeStyles } from '$utils/StyleHelper';

export const DEFAULT_SIZE = {
  width: 'auto',
  height: 'auto',
};

type ScreenIndents = {
  'margin-top'?: string,
  'margin-right'?: string,
  'margin-bottom'?: string,
  'margin-left'?: string,
  'padding-top': string,
  'padding-right': string,
  'padding-bottom': string,
  'padding-left': string,
}

export const DEFAULT_INDENTS: ScreenIndents = {
  'margin-top': '0px',
  'margin-right': '0px',
  'margin-bottom': '0px',
  'margin-left': '0px',
  'padding-top': '5px',
  'padding-right': '5px',
  'padding-bottom': '5px',
  'padding-left': '5px',
};

export const DEFAULT_DISPLAY: CssLikeStyles = { 
  display: 'block',
  'flex-direction': 'row',
  'justify-content': 'flex-start',
  'align-items': 'stretch',
};

type ScreenBorders = {
  'border-width': string,
  'border-color': string,
  'border-style': string,
  'border-radius': string,
}

export const DEFAULT_BORDER: ScreenBorders = {
  'border-width': '0px',
  'border-color': '#323232',
  'border-style': 'solid',
  'border-radius': '0px',
};


type ScreenBackground = {
  'background-color': string,
  'background-image': string,
  'background-repeat': string,
  'background-size': string,
}

export const DEFAULT_BACKGROUND: ScreenBackground = {
  'background-color': 'rgba(255, 255, 255, 0)',
  'background-image': 'none',
  'background-repeat': 'no-repeat',
  'background-size': 'cover',
};

export const DEFAULT_BULLETS: CssLikeStyles = {
  'list-style-type': 'disc',
};

type ScreenTypography = {
  'font-family': string,
  'color': string,
  'font-size': string,
  'line-height': string,
  'font-style': string,
  'font-weight': number,
  'text-align': string,
}

export const DEFAULT_TYPOGRAPHY: ScreenTypography = {
  color: '#323232',
  'font-family': '"Roboto", sans-serif',
  'font-size': '14px',
  'font-style': 'none',
  'font-weight': 400,
  'line-height': '1.5',
  'text-align': 'left',
};
