import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import useResizeObserver from '@react-hook/resize-observer';
import * as R from 'ramda';
import SaveElementAction from './Actions/SaveElementAction';
import Borders from './Borders/Borders';
import BorderCrumb from './Crumb/BorderCrumb';
import {
  selectBorderedElementsRef,
  selectCurrentProject,
  selectCurrentRootId,
  selectElementById,
} from '../../../redux/project/selectors';
import { BorderStyles } from '../../../types';
import { AppReduxState } from '../../../redux/types';

type Props = {
  elementId: string;
};

const getBorderStyles = (
  elementDOM: HTMLElement | null,
  rootRef: React.RefObject<HTMLElement>,
) => {
  const rect = elementDOM?.getBoundingClientRect();
  const rootRect = rootRef?.current?.getBoundingClientRect();

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

const InteractionsHandler = ({ elementId }: Props) => {
  const borderedElementsRefs = useSelector(selectBorderedElementsRef);
  const rootID = useSelector(selectCurrentRootId);
  const rootRef = borderedElementsRefs[rootID];
  const elementRef = borderedElementsRefs[elementId];

  const element = useSelector(selectElementById(elementId));
  const elementGroupStyles = useSelector((state: AppReduxState) => {
    return selectCurrentProject(state).projectData.classes.find((value) => {
      return value.className === element.styles.classNames[1];
    })?.rules;
  });

  const [styles, setStyles] = useState<BorderStyles | null>(
    getBorderStyles(elementRef.current, rootRef),
  );

  const updateBorderStyles = useCallback(
    (entry: HTMLElement) => {
      const updatedBorderStyles = getBorderStyles(
        entry as HTMLElement,
        rootRef,
      );
      if (!R.equals(updatedBorderStyles, styles)) {
        setStyles(updatedBorderStyles);
      }
    },
    [rootRef, styles],
  );

  useResizeObserver(elementRef, (entry) => {
    if (entry) {
      updateBorderStyles(entry.target as HTMLElement);
    }
  });

  useEffect(() => {
    setStyles(getBorderStyles(elementRef.current, rootRef));
  }, [
    borderedElementsRefs,
    elementRef,
    rootRef,
    element.styles.ownStyles,
    elementGroupStyles,
  ]);

  if (!styles) {
    return null;
  }

  return (
    <React.Fragment key={`element-border-${elementId}`}>
      <Borders elementId={elementId} styles={styles} />
      <BorderCrumb elementId={elementId} styles={styles}>
        <SaveElementAction elementId={elementId} />
      </BorderCrumb>
    </React.Fragment>
  );
};

export default InteractionsHandler;
