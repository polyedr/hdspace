const generateFontFace = (
  fontFamily: string,
  pathName: string,
  fontWeight: number,
  fontStyle: string,
): string => `
    @font-face {
      font-family: "${fontFamily}";
      font-weight: ${fontWeight};
      font-style: ${fontStyle};
    
      src: url("fonts/${pathName}.ttf") format("ttf"),
      url("fonts/${pathName}.woff") format("woff"),
      url("fonts/${pathName}.svg#${pathName}") format("svg");
    }
  `;

export default generateFontFace;
