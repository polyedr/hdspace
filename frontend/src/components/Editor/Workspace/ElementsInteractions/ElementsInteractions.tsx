import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import {
  selectActiveElementId,
  selectCurrentRootId,
  selectHoveredElementId,
} from '@Redux/project/selectors/element';
import {
  selectBordersEnabled,
  selectShowingBorders,
} from '@Redux/project/selectors/base';
import InteractionsHandler from './InteractionsHandler';
import { DOMHandler } from '../DOMHandler';

const useStyles = makeStyles({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    maxHeight: 0,
  },
});

const ElementsInteractions: React.FC = () => {
  const activeElementId = useSelector(selectActiveElementId);
  const hoveredElementId = useSelector(selectHoveredElementId);
  const rootId = useSelector(selectCurrentRootId);

  const rootDom = DOMHandler.INSTANCE.getDomById(rootId);
  const activeElementDom = DOMHandler.INSTANCE.getDomById(activeElementId);

  const hoveredElementDom = DOMHandler.INSTANCE.getDomById(hoveredElementId);

  const showBorders = useSelector(selectShowingBorders);
  const bordersEnabled = useSelector(selectBordersEnabled);

  const idsToExclude = [activeElementId];
  if (!!hoveredElementId && hoveredElementId !== activeElementId) {
    idsToExclude.push(hoveredElementId);
  }

  const classes = useStyles();

  if (!rootDom || !bordersEnabled) {
    return null;
  }

  return (
    <div className={classes.container}>
      {activeElementId && activeElementDom && (
        <InteractionsHandler
          key={`border-handler-${activeElementId}`}
          elementId={activeElementId}
          elementDom={activeElementDom}
          rootDom={rootDom}
        />
      )}
      {hoveredElementDom && hoveredElementId !== activeElementId && (
        <InteractionsHandler
          key={`border-handler-${hoveredElementId}`}
          elementId={hoveredElementId}
          elementDom={hoveredElementDom}
          rootDom={rootDom}
        />
      )}
      {showBorders &&
        Object.keys(DOMHandler.INSTANCE.elementsDom)
          .filter((id) => !idsToExclude.includes(id))
          .map((id) => {
            const elDom = DOMHandler.INSTANCE.getDomById(id);
            if (!elDom) {
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
