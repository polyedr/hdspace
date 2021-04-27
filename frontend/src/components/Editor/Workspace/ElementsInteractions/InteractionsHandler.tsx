import React, { memo, useState, useEffect, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import useResizeObserver from '@react-hook/resize-observer';
import { equals } from 'ramda';
import { selectCurrentProject } from '@Redux/project/selectors/base';
import {
  BorderStyles,
  DropTargetParams,
  Screen,
  StateElement,
} from '@Src/types';
import { AppReduxState } from '@Redux/types';
import SaveElementAction from './Actions/SaveElement/SaveElementAction';
import Borders from './Borders/Borders';
import BorderCrumb from './Crumb/BorderCrumb';
import CreateGroupAction from './Actions/CreateGroup/CreateGroupAction';

type Props = {
  element: StateElement;
  elementDom: HTMLElement;
  rootDom: HTMLElement;
  canCreateGroup: boolean;
  screen: Screen;
  selectedElementsIds: string[];
  showBorders: boolean;
  activeElementId: string;
  currentProjectId: number;
  masterScreenId: number | null;
  hoveredElementId: string;
  preSelectedElementId: string | null;
  dropTargetParams: DropTargetParams | null;
  enableDropTargetBordersMode: boolean;
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

const InteractionsHandler = ({
  element,
  elementDom,
  rootDom,
  canCreateGroup,
  screen,
  selectedElementsIds,
  showBorders,
  activeElementId,
  currentProjectId,
  masterScreenId,
  hoveredElementId,
  preSelectedElementId,
  dropTargetParams,
  enableDropTargetBordersMode,
}: Props) => {
  const elementGroupStyles = useSelector((state: AppReduxState) => {
    return selectCurrentProject(state).projectData.classes.find((value) => {
      return value.className === element.styles.classNames?.[1];
    })?.rules;
  });

  const [styles, setStyles] = useState<BorderStyles | null>(
    getBorderStyles(elementDom, rootDom),
  );

  const updateBorderStyles = useCallback(
    (entry: HTMLElement) => {
      const updatedBorderStyles = getBorderStyles(
        entry as HTMLElement,
        rootDom,
      );
      if (!equals(updatedBorderStyles, styles)) {
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
    <React.Fragment key={`element-border-${element.id}`}>
      <Borders
        elementId={element.id}
        styles={styles}
        dropTargetParams={dropTargetParams}
        preSelectedElementId={preSelectedElementId}
        enableDropTargetBordersMode={enableDropTargetBordersMode}
        isActiveBorder={[
          activeElementId,
          hoveredElementId,
          dropTargetParams?.id,
          preSelectedElementId,
        ].includes(element.id)}
      />
      <BorderCrumb
        element={element}
        styles={styles}
        rootId={screen.element}
        currentProjectId={currentProjectId}
        masterScreenId={masterScreenId}
        show={showBorders || element.id === activeElementId}
      >
        {screen.id !== masterScreenId && (
          <>
            <SaveElementAction element={element} />
            <CreateGroupAction
              element={element}
              canCreateGroup={canCreateGroup}
              selectedElementsIds={selectedElementsIds}
              screenId={screen.id}
            />
          </>
        )}
      </BorderCrumb>
    </React.Fragment>
  );
};

export default memo(InteractionsHandler);
