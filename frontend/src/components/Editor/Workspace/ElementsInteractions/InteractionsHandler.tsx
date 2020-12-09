import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import useResizeObserver from '@react-hook/resize-observer';
import * as R from 'ramda';
import {
  selectElementBeingEdited,
  selectElementById,
} from '@Redux/project/selectors/element';
import { selectCurrentProject } from '@Redux/project/selectors/base';
import { BorderStyles } from '@Src/types';
import { AppReduxState } from '@Redux/types';
import SaveElementAction from './Actions/SaveElementAction';
import Borders from './Borders/Borders';
import BorderCrumb from './Crumb/BorderCrumb';

type Props = {
  elementId: string;
  elementDom: HTMLElement;
  rootDom: HTMLElement;
};

const getBorderStyles = (elDom: HTMLElement, rootElDom: HTMLElement) => {
  const rect = elDom?.getBoundingClientRect();
  const rootRect = rootElDom?.getBoundingClientRect();

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

const InteractionsHandler = ({ elementId, elementDom, rootDom }: Props) => {
  const element = useSelector(selectElementById(elementId));
  const elementGroupStyles = useSelector((state: AppReduxState) => {
    return selectCurrentProject(state).projectData.classes.find((value) => {
      return value.className === element.styles.classNames[1];
    })?.rules;
  });
  const elementBeingEdited = useSelector(selectElementBeingEdited(elementId));

  const [styles, setStyles] = useState<BorderStyles | null>(
    getBorderStyles(elementDom, rootDom),
  );

  // console.log('STYLES!!', elementId, styles);

  const updateBorderStyles = useCallback(
    (entry: HTMLElement) => {
      const updatedBorderStyles = getBorderStyles(
        entry as HTMLElement,
        rootDom,
      );
      if (!R.equals(updatedBorderStyles, styles)) {
        setStyles(updatedBorderStyles);
      }
    },
    [rootDom, styles],
  );

  const elRef = useRef(elementDom);
  useResizeObserver(elRef, (entry) => {
    if (entry) {
      updateBorderStyles(entry.target as HTMLElement);
    }
  });

  useEffect(() => {
    setStyles(getBorderStyles(elementDom, rootDom));
  }, [element.styles.ownStyles, elementDom, elementGroupStyles, rootDom]);

  if (!styles) {
    return null;
  }

  return (
    <React.Fragment key={`element-border-${elementId}`}>
      <Borders elementId={elementId} styles={styles} />
      {!elementBeingEdited && (
        <BorderCrumb elementId={elementId} styles={styles}>
          <SaveElementAction elementId={elementId} />
        </BorderCrumb>
      )}
    </React.Fragment>
  );
};

export default InteractionsHandler;
