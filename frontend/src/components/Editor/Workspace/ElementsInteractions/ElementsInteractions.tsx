import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import {
  selectSelectedElementsIds,
  selectActiveElementId,
  selectCurrentRootId,
  selectHoveredElementId,
  selectPreSelectedElementId,
} from '@Redux/project/selectors/element';
import {
  selectBordersEnabled,
  selectCurrentDropTargetId,
  selectShowingBorders,
} from '@Redux/project/selectors/base';
import InteractionsHandler from './InteractionsHandler';
import { DOMHandler } from '../DOMHandler';

const useStyles = makeStyles({
  container: ({ posRight }: Props) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: posRight ? -posRight : 0,
    maxHeight: 0,
  }),
});

type Props = {
  posRight: number | null;
};

const ElementsInteractions: React.FC<Props> = (props) => {
  const preSelectedElementId = useSelector(selectPreSelectedElementId);
  const activeElementId = useSelector(selectActiveElementId);
  const hoveredElementId = useSelector(selectHoveredElementId);
  const dropTargetId = useSelector(selectCurrentDropTargetId);
  const selectedElements = useSelector(selectSelectedElementsIds);
  const rootId = useSelector(selectCurrentRootId);

  const rootDom = DOMHandler.INSTANCE.getDomById(rootId);
  const preSelectedElementDom = DOMHandler.INSTANCE.getDomById(
    preSelectedElementId,
  );
  const activeElementDom = DOMHandler.INSTANCE.getDomById(activeElementId);
  const hoveredElementDom = DOMHandler.INSTANCE.getDomById(hoveredElementId);
  const dropTargetDom = DOMHandler.INSTANCE.getDomById(dropTargetId);
  const showBorders = useSelector(selectShowingBorders);
  const bordersEnabled = useSelector(selectBordersEnabled);

  const idsToExclude = [preSelectedElementId, activeElementId];
  if (!!hoveredElementId && hoveredElementId !== activeElementId) {
    idsToExclude.push(hoveredElementId);
  }
  if (
    !!dropTargetId &&
    ![preSelectedElementId, activeElementId, hoveredElementId].includes(
      dropTargetId,
    )
  ) {
    idsToExclude.push(dropTargetId);
  }

  const classes = useStyles(props);

  if (!rootDom || !bordersEnabled) {
    return null;
  }

  return (
    <div className={classes.container}>
      {preSelectedElementId && preSelectedElementDom && (
        <InteractionsHandler
          key={`border-handler-${preSelectedElementId}`}
          elementId={preSelectedElementId}
          elementDom={preSelectedElementDom}
          rootDom={rootDom}
        />
      )}
      {activeElementDom && activeElementId !== preSelectedElementId && (
        <InteractionsHandler
          key={`border-handler-${activeElementId}`}
          elementId={activeElementId}
          elementDom={activeElementDom}
          rootDom={rootDom}
        />
      )}
      {hoveredElementDom &&
        ![preSelectedElementId, activeElementId].includes(hoveredElementId) && (
          <InteractionsHandler
            key={`border-handler-${hoveredElementId}`}
            elementId={hoveredElementId}
            elementDom={hoveredElementDom}
            rootDom={rootDom}
          />
        )}
      {dropTargetDom &&
        dropTargetId &&
        ![preSelectedElementId, hoveredElementId, activeElementId].includes(
          dropTargetId,
        ) && (
          <InteractionsHandler
            key={`border-handler-${dropTargetId}`}
            elementId={dropTargetId}
            elementDom={dropTargetDom}
            rootDom={rootDom}
          />
        )}
      {showBorders &&
        [
          ...new Set(
            [...Object.keys(DOMHandler.INSTANCE.elementsDom)].filter(
              (elementId) => !idsToExclude.includes(elementId),
            ),
          ),
        ].map((id) => {
          const elDom = DOMHandler.INSTANCE.getDomById(id);
          if (!elDom || !id) {
            return null;
          }
          return (
            <InteractionsHandler
              key={`border-handler-${id}`}
              elementId={id}
              elementDom={elDom}
              rootDom={rootDom}
            />
          );
        })}
      {!showBorders &&
        selectedElements.length &&
        [
          ...new Set(
            selectedElements.filter(
              (elementId) => !idsToExclude.includes(elementId),
            ),
          ),
        ].map((id) => {
          const elDom = DOMHandler.INSTANCE.getDomById(id);
          if (!elDom || !id) {
            return null;
          }
          return (
            <InteractionsHandler
              key={`border-handler-${id}`}
              elementId={id}
              elementDom={elDom}
              rootDom={rootDom}
            />
          );
        })}
    </div>
  );
};

export default ElementsInteractions;
