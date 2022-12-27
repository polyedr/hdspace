/* eslint-disable react/no-unused-prop-types */
import React, { useContext, useCallback, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  selectActiveElement,
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
  selectEditableStyles,
} from '@Redux/project/selectors/base';
import {
  selectCurrentScreenId,
  selectCurrentScreen,
  selectMasterScreenId,
  selectMasterScreenEnabled,
} from '@Redux/project/selectors/screen';
import { ALL_ELEMENTS_INDEX } from '@Constants/defaultParams';
import { enqueueSnackbar } from '@Redux/notification/actions';
import {
  updateMultipleElementsStyles,
  updateSharedStyles,
} from '@Redux/project/actions';
import { Entity } from '@Src/types';
import { selectUserProfileDataParameters } from '@Redux/user/selectors';
import { WindowContext } from '@Components/Editor/FrameWrapper/FrameContext';
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

interface Props {
  posRight: number | null;
}

const ElementsInteractions: React.FC<Props> = (props) => {
  const dispatch = useDispatch();
  const allElements = useSelector(selectAllElements);
  const preSelectedElementId = useSelector(selectPreSelectedElementId);
  const activeElement = useSelector(selectActiveElement);
  const activeElementId = useSelector(selectActiveElementId);
  const hoveredElementId = useSelector(selectHoveredElementId);
  const dropTargetId = useSelector(selectCurrentDropTargetId);
  const showBorders = useSelector(selectShowingBorders);
  const currentScreen = useSelector(selectCurrentScreen);
  const masterScreenId = useSelector(selectMasterScreenId);
  const canCreateGroup = useSelector(selectCanCreateGroup);
  const selectedElementsIds = useSelector(selectSelectedElementsIds);
  const dropTargetParams = useSelector(selectCurrentDropTargetParams);
  const currentScreenId = useSelector(selectCurrentScreenId);
  const editableStyles = useSelector(selectEditableStyles);
  const { dropTargetBordersMode } = useSelector(
    selectUserProfileDataParameters,
  );
  const bordersEnabled = useSelector(selectBordersEnabled);
  const currentProjectId = useSelector(selectCurrentProjectId);
  const masterScreenEnabled = useSelector(selectMasterScreenEnabled);

  const frameWindow = useContext(WindowContext);

  const isGroupSource = !!activeElement.parameters.groupElements;
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

  const updateStyles = useCallback(
    (styles: React.CSSProperties) => {
      if (!selectedElementsIds.length) {
        dispatch(
          enqueueSnackbar({
            message: 'No elements were selected',
            options: { variant: 'error' },
          }),
        );
      } else if (selectedElementsIds.length > 1) {
        dispatch(
          updateMultipleElementsStyles(
            selectedElementsIds,
            { [ALL_ELEMENTS_INDEX]: styles },
            { screenId: currentScreenId },
          ),
        );
      } else if (masterScreenEnabled) {
        if (isGroupSource) {
          const groupElementsIds = activeElement.parameters.groupElements;
          dispatch(
            updateMultipleElementsStyles(
              [activeElement.id, ...groupElementsIds],
              {
                [ALL_ELEMENTS_INDEX]: styles,
              },
              { screenId: currentScreenId },
            ),
          );
        } else {
          dispatch(
            updateSharedStyles(
              (masterScreenEnabled
                ? activeElement.type
                : editableStyles) as Entity,
              styles,
              {
                screenId: currentScreenId,
              },
            ),
          );
        }
      } else if (editableStyles === 'ownStyles') {
        dispatch(
          updateMultipleElementsStyles(
            [activeElement.id],
            {
              [ALL_ELEMENTS_INDEX]: styles,
            },
            { screenId: currentScreenId },
          ),
        );
      } else {
        dispatch(
          updateSharedStyles(
            (masterScreenEnabled
              ? activeElement.type
              : editableStyles) as Entity,
            styles,
            {
              screenId: currentScreenId,
            },
          ),
        );
      }
    },
    [
      selectedElementsIds,
      masterScreenEnabled,
      editableStyles,
      dispatch,
      currentScreenId,
      isGroupSource,
      activeElement.parameters.groupElements,
      activeElement.id,
      activeElement.type,
    ],
  );

  if (!frameWindow || !bordersEnabled) {
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
            frameWindow={frameWindow.window}
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
            updateStyles={updateStyles}
          />
        );
      })}
    </div>
  );
};

export default memo(ElementsInteractions);
