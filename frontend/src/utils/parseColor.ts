const isColor = (color: string) => {
  // const colorHexRegExp = /#[0-9a-f]{6}\b/i;
  const colorHexRegExp = /#[0-9a-f]{6}\b|#[0-9a-f]{3}\b/gi;

  return color.search(colorHexRegExp) !== -1;
};

export default isColor;
