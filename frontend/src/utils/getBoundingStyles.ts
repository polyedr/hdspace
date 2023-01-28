import { BoundingStyles } from '@Src/types';

const getBoundingStyles = (
  elDom: HTMLElement,
  window: Window,
  rootId: string,
) => {
  const rect = elDom?.getBoundingClientRect();
  const rootEl = window.document.getElementById(rootId);
  if (!rootEl) {
    return null;
  }
  const rootRect = rootEl.getBoundingClientRect();

  return rect && rootRect
    ? ({
        top: rect.top - rootRect.top,
        bottom: rootRect.bottom - rect.bottom,
        right: rootRect.right - rect.right,
        left: rect.left - rootRect.left,
        width: rect.width,
        height: rect.height,
      } as BoundingStyles)
    : null;
};

export default getBoundingStyles;
