import React, { useCallback, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Scrollbars from 'react-custom-scrollbars';
import { Divider } from '@mui/material';
import { makeStyles } from '@mui/styles';
import RENDERERS from '@Components/UI/RenderElements';
import {
  selectElementByIdWrapper,
  selectMasterCoreElementId,
  selectMasterGroupsElementId,
  selectMasterScreenRoot,
} from '@Redux/project/selectors/element';
import prevent from '@Utils/preventEvent';
import { setActiveElement, setHoveredElementId } from '@Redux/project/actions';
import { DropTargetParams, Normalized, StateElement } from '@Src/types';
import { selectMasterScreenId } from '@Redux/project/selectors/screen';
import { selectCurrentProjectClasses } from '@Redux/project/selectors/base';
import { DOMHandler } from '../Workspace/DOMHandler';
import DraggableElement from '../Draggable/DraggableElement';

interface Props {
  allElements: Normalized<StateElement>;
  isDisabled: boolean;
  dropTargetParams: DropTargetParams | null;
  preSelectedElementId: string | null;
  masterSourceElementId: string | null;
  canDragAndDrop: boolean;
  frameWindow: Window | null;

  elementId: string;
  parentId?: string;
  scrollRef: React.RefObject<Scrollbars>;
}

const useStyles = makeStyles({
  divider: {
    margin: '10px 0',
  },
});

const MasterElement: React.FC<Props> = (props: Props) => {
  const {
    allElements,
    isDisabled,
    dropTargetParams,
    preSelectedElementId,
    masterSourceElementId,
    canDragAndDrop,
    frameWindow,
    elementId,
    parentId,
    scrollRef,
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const element = useSelector(selectElementByIdWrapper(elementId));
  const masterScreenId = useSelector(selectMasterScreenId);
  const masterCoreElId = useSelector(selectMasterCoreElementId);
  const masterGroupsElId = useSelector(selectMasterGroupsElementId);
  const rootElement = useSelector(selectMasterScreenRoot);
  const projectClasses = useSelector(selectCurrentProjectClasses);

  const { type } = element;

  const Renderer = RENDERERS[type];

  const handleClick = useCallback(
    (ev: React.MouseEvent<HTMLElement>) => {
      prevent(ev);
      dispatch(setActiveElement(elementId));
    },
    [dispatch, elementId],
  );

  useEffect(
    () => () => {
      DOMHandler.INSTANCE.removeElementDom(element.id);
    },
    [element.id],
  );

  if (!element) {
    return null;
  }

  return masterScreenId ? (
    <Renderer
      ref={(dom: HTMLElement) => {
        DOMHandler.INSTANCE.addElementDom(element.id, dom);
      }}
      onClick={handleClick}
      onMouseEnter={() => {
        dispatch(setHoveredElementId(element.id));
      }}
      onMouseLeave={() => {
        dispatch(setHoveredElementId(parentId || null));
      }}
      element={element}
      isDisabled={isDisabled}
    >
      {element.children.map((childId, index) => (
        <Fragment key={`master-${childId}`}>
          {!!index &&
            [masterCoreElId, masterGroupsElId, rootElement?.id].includes(
              elementId,
            ) && (
              <Divider
                orientation="horizontal"
                variant="middle"
                className={classes.divider}
              />
            )}
          {element.id === masterGroupsElId ? (
            <DraggableElement
              screenId={masterScreenId}
              elementId={elementId}
              allElements={allElements}
              scrollRef={scrollRef}
              isDisabled={isDisabled}
              preSelectedElementId={preSelectedElementId}
              masterSourceElementId={masterSourceElementId}
              canDragAndDrop={canDragAndDrop}
              projectClasses={projectClasses}
            />
          ) : (
            <MasterElement
              elementId={childId}
              parentId={element.id}
              scrollRef={scrollRef}
              allElements={allElements}
              isDisabled={isDisabled}
              dropTargetParams={dropTargetParams}
              preSelectedElementId={preSelectedElementId}
              masterSourceElementId={masterSourceElementId}
              canDragAndDrop={canDragAndDrop}
              frameWindow={frameWindow}
            />
          )}
        </Fragment>
      ))}
    </Renderer>
  ) : null;
};

export default MasterElement;
