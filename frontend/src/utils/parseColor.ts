export const isColor = (color) => {
  // const colorHexRegExp = /#[0-9a-f]{6}\b/i;
  const colorHexRegExp = /#[0-9a-f]{6}\b|#[0-9a-f]{3}\b/gi;

  return color.search(colorHexRegExp) !== -1;
};

export const rgbToHex = (color: string, defaultColor?: string): string => {
  if (!color) {
    return defaultColor;
  }

  if (color.charAt(0) === '#') {
    return color;
  }

  if (color.indexOf('rgb') !== 0) {
    return defaultColor;
  }

  const nums = /(.*?)rgb\((\d+),\s*(\d+),\s*(\d+)\)/i.exec(color);
  const r = parseInt(nums[2], 10).toString(16);
  const g = parseInt(nums[3], 10).toString(16);
  const b = parseInt(nums[4], 10).toString(16);

  return `#${(
    (r.length === 1 ? `0${r}` : r)
    + (g.length === 1 ? `0${g}` : g)
    + (b.length === 1 ? `0${b}` : b)
  )}`;
};
