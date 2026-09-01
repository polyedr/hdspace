import { ColorResult } from 'react-color';
import { equals } from 'ramda';

const needOpacityNormalize = (color: ColorResult, prevColor: ColorResult) => {
  const isRGBChanged = !equals(prevColor.rgb, color.rgb);
  const isOpacityZero = prevColor.rgb.a === 0 && color.rgb.a === 0;

  return isRGBChanged && isOpacityZero;
};

const normalizeColor = (
  color: string | ColorResult,
  prevColor: ColorResult,
) => {
  if (typeof color === 'object') {
    return color.rgb.a === 1 || needOpacityNormalize(color, prevColor)
      ? { value: color.hex, isValid: true }
      : {
          value: `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`,
          isValid: true,
        };
  }
  if (typeof color === 'string') {
    const isHex =
      /^#?(([0-9A-F]{3})([0-9A-F]{1})?|([0-9A-F]{6})([0-9A-F]{2})?)$/i.test(
        color,
      );

    const rgbOrRgbaRegExp =
      /^(rgba\s*\(((\d{1,2}|1\d\d|2([0-4]\d|5[0-5]))\s*,\s*){2}((\d{1,2}|1\d\d|2([0-4]\d|5[0-5]))\s*)(,\s*(0|0\.\d+|1))\)|rgb\s*\(((\d{1,2}|1\d\d|2([0-4]\d|5[0-5]))\s*,\s*){2}((\d{1,2}|1\d\d|2([0-4]\d|5[0-5]))\)\s*))$/i;

    const isRgbOrRgbaRegExp = rgbOrRgbaRegExp.test(color);

    if (isHex) {
      return /^#/.test(color)
        ? { value: color, isValid: true }
        : { value: `#${color}`, isValid: true };
    }
    if (isRgbOrRgbaRegExp) {
      return {
        value: color,
        isValid: true,
      };
    }
    return { value: color, isValid: false };
  }
  return { value: '', isValid: false };
};

export default normalizeColor;
