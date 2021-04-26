import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  selectSelectedElementsIds,
  selectActiveElementId,
  selectHoveredElementId,
  selectPreSelectedElementId,
  selectCanCreateGroup,
  selectAllElements,
} from '@Redux/project/selectors/element';
import {
  selectBordersEnabled,
  selectCurrentDropTargetId,
  selectCurrentDropTargetParams,
  selectCurrentProjectId,
  selectShowingBorders,
} from '@Redux/project/selectors/base';
import {
  selectCurrentScreen,
  selectMasterScreenId,
} from '@Redux/project/selectors/screen';
import { selectDropTargetBordersMode } from '@Redux/user/selectors';
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
  const allElements = useSelector(selectAllElements);
  const preSelectedElementId = useSelector(selectPreSelectedElementId);
  const activeElementId = useSelector(selectActiveElementId);
  const hoveredElementId = useSelector(selectHoveredElementId);
  const dropTargetId = useSelector(selectCurrentDropTargetId);
  const showBorders = useSelector(selectShowingBorders);
  const currentScreen = useSelector(selectCurrentScreen);
  const masterScreenId = useSelector(selectMasterScreenId);
  const canCreateGroup = useSelector(selectCanCreateGroup);
  const selectedElementsIds = useSelector(selectSelectedElementsIds);
  const dropTargetParams = useSelector(selectCurrentDropTargetParams);
  const dropTargetBordersMode = useSelector(selectDropTargetBordersMode);
  const bordersEnabled = useSelector(selectBordersEnabled);
  const currentProjectId = useSelector(selectCurrentProjectId);

  const rootDom = DOMHandler.INSTANCE.getDomById(currentScreen.element);

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

  const borderedElementsIds = !showBorders
    ? [
        ...new Set(
          [
            ...selectedElementsIds,
            activeElementId,
            hoveredElementId,
            dropTargetParams?.id,
            preSelectedElementId,
            currentScreen.element,
          ].filter((id) => !!id),
        ),
      ]
    : DOMHandler.INSTANCE.visibleElementsIds;

  if (!rootDom || !bordersEnabled) {
    return null;
  }

  return (
    <div className={classes.container}>
      {borderedElementsIds.map((id) => {
        if (!id) {
          return null;
        }
        const elementDom = DOMHandler.INSTANCE.getDomById(id);
        if (!elementDom) {
          return null;
        }
        return (
          <InteractionsHandler
            key={`border-handler-${id}`}
            element={allElements[id]}
            elementDom={elementDom}
            rootDom={rootDom}
            activeElementId={activeElementId}
            hoveredElementId={hoveredElementId}
            dropTargetParams={dropTargetParams}
            preSelectedElementId={preSelectedElementId}
            canCreateGroup={canCreateGroup}
            screen={currentScreen}
            currentProjectId={currentProjectId}
            enableDropTargetBordersMode={dropTargetBordersMode}
            masterScreenId={masterScreenId}
            showBorders={showBorders}
            selectedElementsIds={selectedElementsIds}
          />
        );
      })}
    </div>
  );
};

export default ElementsInteractions;
