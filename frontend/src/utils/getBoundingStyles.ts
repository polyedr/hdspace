import { BoundingStyles } from '@Src/types';

const getBoundingStyles = (elDom: HTMLElement, window: Window) => {
  const rect = elDom?.getBoundingClientRect();
  const bodyRect = window.document.body?.getBoundingClientRect();

  return rect && bodyRect
    ? ({
        top: rect.top - bodyRect.top,
        bottom: bodyRect.bottom - rect.bottom,
        right: bodyRect.right - rect.right,
        left: rect.left - bodyRect.left,
        width: rect.width,
        height: rect.height,
      } as BoundingStyles)
    : null;
};

export default getBoundingStyles;
