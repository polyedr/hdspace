import CONTROLS from '@Constants/controls';

const getControlStyles = (
  controlName: string,
  currentEditableStyles: React.CSSProperties,
) => {
  const controlInfo = CONTROLS[controlName];
  if (!controlInfo.styles) {
    return {};
  }
  return controlInfo.styles.reduce((acc, styleName) => {
    if (!currentEditableStyles[styleName]) {
      return acc;
    }
    return {
      ...acc,
      [styleName]: currentEditableStyles[styleName],
    };
  }, {});
};

export default getControlStyles;
