import React, { useContext, useCallback, useState, useMemo } from 'react';
import { WindowContext } from '@Components/Editor/FrameWrapper/FrameContext';
import { BoundingStyles, StateElement } from '@Src/types';
import getBoundingStyles from '@Utils/getBoundingStyles';
import Resizer from '../Resizer/Resizer';

type Size = {
  width: CSSStyleDeclaration['width'];
  height: CSSStyleDeclaration['height'];
};

const useResizer = <T extends HTMLElement>(element: StateElement) => {
  const frameWindow = useContext(WindowContext);
  const [styles, setStyles] = useState<BoundingStyles | null>(null);

  const resize = useCallback(
    (dom: T) => {
      if (!frameWindow) {
        return;
      }
      const boundingStyles = getBoundingStyles(dom, frameWindow);
      if (boundingStyles) {
        setStyles(boundingStyles);
      }
    },
    [frameWindow],
  );

  const output: [(dom: T) => void, any] = useMemo(
    () => [
      resize,
      styles ? <Resizer styles={styles} type={element.type} /> : null,
    ],
    [element.type, resize, styles],
  );

  return output;
};

export default useResizer;
