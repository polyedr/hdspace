import * as R from 'ramda';

import {
  MAX_BORDER_RADIUS,
  MAX_BORDER_RADIUS_PERCENT,
  MIN_BORDER_RADIUS,
} from '$constants/defaultParams';
// import {
//   IScreenBackground, IScreenBorders,
//   IScreenIndents,
//   IScreenProps,
//   IScreenTypography,
// } from '$redux/project/types';
// import { rgbToHex } from '$utils/parseColor';

export interface CssLikeStyles {
  display?: string;

  width?: number | string,
  height?: number | string,
  'min-height'?: number | string,
  'min-width'?: number | string,

  'margin-top'?: string,
  'margin-right'?: string,
  'margin-bottom'?: string,
  'margin-left'?: string,
  'padding-top'?: string,
  'padding-right'?: string,
  'padding-bottom'?: string,
  'padding-left'?: string,

  'border-width'?: string,
  'border-color'?: string,
  'border-radius'?: string,

  'background-color'?: string,
  'background-image'?: string,
  'background-repeat'?: string,
  'background-size'?: string,

  'font-family'?: string,
  'color'?: string,
  'font-size'?: string,
  'line-height'?: string,
  'font-style'?: string,
  'font-weight'?: number,
  'text-align'?: string,

  'flex-direction'?: string;
  'align-items'?: string;
  'justify-content'?: string;
}

type TConvertIndents = (styles: CssLikeStyles) => {
  marginTop?: string,
  marginRight?: string,
  marginBottom?: string,
  marginLeft?: string,
  paddingTop?: string,
  paddingRight?: string,
  paddingBottom?: string,
  paddingLeft?: string,
};

type TConvertBackground = (styles: CssLikeStyles) => {
  backgroundColor?: string,
  backgroundImage?: string,
  backgroundSize?: string,
  backgroundRepeat?: string,
};

type TConvertBorders = (styles: CssLikeStyles) => {
  borderWidth?: string,
  borderStyle?: string,
  borderColor?: string,
  borderRadius?: string,
};

type TConvertTypography = (styles: CssLikeStyles) => {
  fontFamily?: string,
  color?: string,
  fontSize?: string,
  fontStyle?: string,
  lineHeight?: string,

  // TODO: ошибка, когда эти свойста присутствуют
  fontWeight?: any,
  textAlign?: any,
};

const convertIndents: TConvertIndents = styles => (
  R.keys(styles).reduce((result, key) => {
    switch (key) {
      case 'margin-top':
        return { ...result, marginTop: styles[key] };
      case 'margin-right':
        return { ...result, marginRight: styles[key] };
      case 'margin-bottom':
        return { ...result, marginBottom: styles[key] };
      case 'margin-left':
        return { ...result, marginLeft: styles[key] };
      case 'padding-top':
        return { ...result, paddingTop: styles[key] };
      case 'padding-right':
        return { ...result, paddingRight: styles[key] };
      case 'padding-bottom':
        return { ...result, paddingBottom: styles[key] };
      case 'padding-left':
        return { ...result, paddingLeft: styles[key] };
      default: return result;
    }
  }, {})
);

const convertBackground: TConvertBackground = styles => (
  R.keys(styles).reduce((result, key) => {
    switch (key) {
      case 'background-color':
        return { ...result, backgroundColor: styles[key] };
      case 'background-image':
        return { ...result, backgroundImage: styles[key] };
      case 'background-size':
        return { ...result, backgroundSize: styles[key] };
      case 'background-repeat':
        return { ...result, backgroundRepeat: styles[key] };
      default: return result;
    }
  }, {})
);

const otherStyles = (styles: CssLikeStyles): React.CSSProperties => (
  R.keys(styles).reduce((acc, key) => {
    switch (key) {
      case 'flex-direction':
        return { ...acc, flexDirection: styles[key] };
      case 'justify-content':
        return { ...acc, justifyContent: styles[key] };
      case 'align-items':
        return { ...acc, alignItems: styles[key] };
      case 'min-height':
        return { ...acc, minHeight: styles[key] };
      case 'min-width':
        return { ...acc, minWidth: styles[key] };
      case 'display':
        return { ...acc, display: styles[key] };
      default: return acc;
    }
  }, {})
);

export const convertBorders: TConvertBorders = styles => (
  R.keys(styles).reduce((result, key) => {
    switch (key) {
      case 'border-color':
        return { ...result, borderColor: styles[key] };
      case 'border-width':
        return { ...result, borderWidth: styles[key] };
      case 'border-radius':
        return { ...result, borderRadius: styles[key] };
      default: return result;
    }
  }, {})
);

export const convertTypography: TConvertTypography = styles => (
  R.keys(styles).reduce((result, key) => {
    switch (key) {
      case 'font-family':
        return { ...result, fontFamily: styles[key] };
      case 'color':
        return { ...result, color: styles[key] };
      case 'font-size':
        return { ...result, fontSize: styles[key] };
      case 'font-style':
        return { ...result, fontStyle: styles[key] };
      case 'font-weight':
        return { ...result, fontWeight: styles[key] };
      case 'line-height':
        return { ...result, lineHeight: styles[key] };
      case 'text-align':
        return { ...result, textAlign: styles[key] };
      default: return result;
    }
  }, {})
);

export const convertPropCSS = (styles: CssLikeStyles): React.CSSProperties => ({
  width: styles.width,
  height: styles.height,
  ...convertIndents(styles),
  ...convertBackground(styles),
  ...convertBorders(styles),
  ...convertTypography(styles),
  ...otherStyles(styles),
});

export const validateBorderRadius = (radius?: string): string | undefined => {
  if (typeof radius === 'undefined') return undefined;

  const value = parseInt(radius, 10) || MIN_BORDER_RADIUS;

  if (!radius || radius.indexOf('%') === -1) {
    return `${R.clamp(MIN_BORDER_RADIUS, MAX_BORDER_RADIUS, value)}px`;
  }

  return `${R.clamp(MIN_BORDER_RADIUS, MAX_BORDER_RADIUS_PERCENT, value)}%`;
};
