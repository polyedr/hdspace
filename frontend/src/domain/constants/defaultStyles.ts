import { IScreenIndents, IScreenBorders, IScreenBackground, IScreenTypography } from '$redux/project/types'; // TODO why redux
import { CssLikeStyles } from '$utils/StyleHelper';

export const DEFAULT_SIZE = {
  width: 'auto',
  height: 'auto',
};

export const DEFAULT_INDENTS: IScreenIndents = {
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

export const DEFAULT_BORDER: IScreenBorders = {
  'border-width': '0px',
  'border-color': '#323232',
  'border-style': 'solid',
  'border-radius': '0px',
};

export const DEFAULT_BACKGROUND: IScreenBackground = {
  'background-color': 'rgba(255, 255, 255, 0)',
  'background-image': 'none',
  'background-repeat': 'no-repeat',
  'background-size': 'cover',
};

export const DEFAULT_BULLETS: CssLikeStyles = {
  'list-style-type': 'disc',
};

export const DEFAULT_TYPOGRAPHY: IScreenTypography = {
  color: '#323232',
  'font-family': '"Roboto", sans-serif',
  'font-size': '14px',
  'font-style': 'none',
  'font-weight': 400,
  'line-height': '1.5',
  'text-align': 'left',
};
