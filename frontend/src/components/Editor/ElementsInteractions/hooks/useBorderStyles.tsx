import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { AppReduxState } from 'src/shared/types/app';
import {
  selectElementBorderedRect,
  selectRootBorderedRect,
} from '../../../../redux/project/selectors';

export type BorderStyles = {
  top: number;
  bottom: number;
  right: number;
  left: number;
  width: number;
  height: number;
};

const useBorderStyles = (elementId: string) => {
  const { rect, rootRect } = useSelector((state: AppReduxState) => ({
    rect: selectElementBorderedRect(elementId)(state),
    rootRect: selectRootBorderedRect(state),
  }));

  const styles = useMemo(() => {
    return rect && rootRect
      ? ({
          top: rect.top - rootRect.top,
          bottom: rootRect.bottom - rect.bottom,
          right: rootRect.right - rect.right,
          left: rect.left - rootRect.left,
          width: rect.width,
          height: rect.height,
        } as BorderStyles)
      : null;
  }, [rect.top, rect.bottom, rect.left, rect.right, rootRect]);
  return styles;
};

export default useBorderStyles;
