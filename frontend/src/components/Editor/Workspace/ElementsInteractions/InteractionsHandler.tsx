import React, { memo, useState, useEffect, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import useResizeObserver from '@react-hook/resize-observer';
import { equals } from 'ramda';
import { selectCurrentProject } from '@Redux/project/selectors/base';
import {
  BoundingStyles,
  DropTargetParams,
  Screen,
  StateElement,
} from '@Src/types';
import { AppReduxState } from '@Redux/types';
import getBoundingStyles from '@Utils/getBoundingStyles';
import SaveElementAction from './Actions/SaveElement/SaveElementAction';
import Borders from './Borders/Borders';
import BorderCrumb from './Crumb/BorderCrumb';
import CreateGroupAction from './Actions/CreateGroup/CreateGroupAction';

type Props = {
  element: StateElement;
  elementDom: HTMLElement;
  frameWindow: Window;
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

const InteractionsHandler = ({
  element,
  elementDom,
  frameWindow,
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

  const [styles, setStyles] = useState<BoundingStyles | null>(
    getBoundingStyles(elementDom, frameWindow),
  );

  const updateBorderStyles = useCallback(
    (entry: HTMLElement) => {
      const updatedBorderStyles = getBoundingStyles(
        entry as HTMLElement,
        frameWindow,
      );
      if (!equals(updatedBorderStyles, styles)) {
        setStyles(updatedBorderStyles);
      }
    },
    [frameWindow, styles],
  );

  const elRef = useRef(elementDom);
  useResizeObserver(elRef, (entry) => {
    if (entry) {
      updateBorderStyles(entry.target as HTMLElement);
    }
  });

  useEffect(() => {
    setStyles(getBoundingStyles(elementDom, frameWindow));
  }, [element.styles.ownStyles, elementDom, elementGroupStyles, frameWindow]);

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
