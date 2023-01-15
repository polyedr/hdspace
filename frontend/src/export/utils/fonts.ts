const fontVariations = {
  regular: 300,
  bold: 700,
  italic: 300,
  bolditalic: 700,
};

export const getFontsUrl = (...fontNames: string[]) => {
  const fontLink = fontNames.reduce((link, name) => {
    const fontParts = Object.keys(fontVariations).map((variant: string) => {
      const fontName = encodeURIComponent(name);
      return `${fontName}:${fontVariations[variant]},${
        fontVariations[variant] + variant
      }`;
    });
    return `${link}${fontParts.join('|')}`;
  }, 'https://fonts.googleapis.com/css?family=');
  return fontLink;
};

export const getFontsLink = (...fontNames: string[]) => {
  const url = getFontsUrl(...fontNames);
  return `<link rel="stylesheet" href="${url}" />`;
};
