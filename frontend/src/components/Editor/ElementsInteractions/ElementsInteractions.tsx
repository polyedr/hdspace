import React from 'react';
import { useSelector } from 'react-redux';
import {
  selectBorderedElementsRef,
  selectBorderedRef,
  selectCurrentRootId,
  /* selectRootBorderedRef, */
} from '../../../redux/project/selectors';
import SaveElementAction from './Actions/SaveElementAction';
import Borders from './Borders/Borders';
import BorderCrumb from './Crumb/BorderCrumb';

export type BorderStyles = {
  top: number;
  bottom: number;
  right: number;
  left: number;
  width: number;
  height: number;
};

const ElementsInteractions: React.FC<any> = () => {
  const borderedElements = useSelector(selectBorderedElementsRef);
  const borderedElementsIds = Object.keys(borderedElements);
  const rootID = useSelector(selectCurrentRootId);
  const rootRef = useSelector(selectBorderedRef(rootID));
  const getBorderStyle = (ref: React.RefObject<HTMLElement>) => {
    if (!rootID || !ref || !ref.current || !rootRef || !rootRef.current) {
      return null;
    }

    const rect = ref.current.getBoundingClientRect();
    const rootRect = rootRef.current?.getBoundingClientRect();

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
  };
  return (
    <>
      {borderedElementsIds.map((id) => {
        const style = getBorderStyle(borderedElements[id]);
        if (!style) {
          return null;
        }
        return (
          <React.Fragment key={`element-border-${id}`}>
            <Borders elementId={id} styles={style} />
            <BorderCrumb elementId={id} styles={style}>
              <SaveElementAction elementId={id} />
            </BorderCrumb>
          </React.Fragment>
        );
      })}
    </>
  );
};

export default ElementsInteractions;
