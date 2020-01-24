import { ColorResult } from "react-color";

export const normalizeColor = (color: string | ColorResult) => {
  if (typeof color === 'object') {
    return color.rgb.a === 1
      ? { value: color.hex, isValid: true }
      : { value: `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`, isValid: true };

  } else if (typeof color === 'string') {
    const isHex = /^#?(([0-9A-F]{3})([0-9A-F]{1})?|([0-9A-F]{6})([0-9A-F]{2})?)$/i.test(color);

    const rgbOrRgbaRegExp = /^(rgba\(((\d{1,2}|1\d\d|2([0-4]\d|5[0-5]))\s*,\s*){2}((\d{1,2}|1\d\d|2([0-4]\d|5[0-5]))\s*)(,\s*(0\.\d+|1))\)|rgb\(((\d{1,2}|1\d\d|2([0-4]\d|5[0-5]))\s*,\s*){2}((\d{1,2}|1\d\d|2([0-4]\d|5[0-5]))\)\s*))$/i;
    const hslOrHslaRegExp = /^(hsla\(\s*((\d{1,2}|[1-2]\d{2}|3([0-5]\d|60)))\s*,\s*((\d{1,2}|100)\s*%)\s*,\s*((\d{1,2}|100)\s*%)(,\s*(0\.\d+|1))\)|hsl\(\s*((\d{1,2}|[1-2]\d{2}|3([0-5]\d|60)))\s*,\s*((\d{1,2}|100)\s*%)\s*,\s*((\d{1,2}|100)\s*%)\))$/i;

    const isRgbOrRgbaRegExp = rgbOrRgbaRegExp.test(color);
    const isHslOrHslaRegExp = hslOrHslaRegExp.test(color);

    if (isHex) {
      return /^#/.test(color)
        ? { value: color, isValid: true }
        : { value: `#${color}`, isValid: true };
    } else if (isRgbOrRgbaRegExp || isHslOrHslaRegExp) {
      return { value: color, isValid: true };
    } else {
      return { value: color, isValid: false };
    }
  }
  return { value: '', isValid: false };
}
