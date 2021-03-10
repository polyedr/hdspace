import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import BasicConfirmForm from '@Components/Forms/BasicConfirmForm';
import {
  selectActiveElement,
  selectCurrentEditableStyles,
  selectMasterCoreElementId,
  selectMasterGroupsElementId,
  selectSelectedElements,
  selectSelectedElementsIds,
} from '@Redux/project/selectors/element';
import {
  selectEditableStyles,
  selectFreeCanvasMode,
} from '@Redux/project/selectors/base';
import { selectIsPrototypeMode } from '@Redux/user/selectors';
import { AVAILABLE_CONTROLS } from '@Domain/core';
import {
  CONTROLS_AFFECT_ON_PARAMS,
  Entity,
  Params,
  PropertyName,
} from '@Src/types';
import {
  removeElementStyles,
  removeMultipleElementsStyles,
  removeSharedStyles,
  unbindGroupElementStyles,
  updateElementParameters,
  updateElementStyles,
  updateMultipleElementsStyles,
  updateSharedStyles,
} from '@Redux/project/actions';
import { enqueueSnackbar } from '@Redux/notification/actions';
import { ALL_ELEMENTS_INDEX, UNIQUE_CONTROLS } from '@Constants/defaultParams';
import {
  selectCurrentScreenId,
  selectMasterScreenEnabled,
} from '@Redux/project/selectors/screen';
import CONTROLS from '@Constants/controls';
import getControlStyles from '@Utils/getControlStyles';
import RenameElement from './Controls/RenameElement/RenameElement';
import ShareStyles from './helperComponents/ShareStyles/ShareStyles';
import Scrollbar from '../../UI/Scrollbar';
import ControlSection from './helperComponents/ControlSection';

const useStyles = makeStyles({
  propertiesTab: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
});

const PropertiesTab: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const activeElement = useSelector(selectActiveElement);
  const masterCoreElementId = useSelector(selectMasterCoreElementId);
  const masterGroupsElementId = useSelector(selectMasterGroupsElementId);
  const selectedElementsIds = useSelector(selectSelectedElementsIds);
  const isFreeCanvasMode = useSelector(selectFreeCanvasMode);
  const isPrototypeMode = useSelector(selectIsPrototypeMode);
  const currentEditableStyles = useSelector(selectCurrentEditableStyles);
  const editableStyles = useSelector(selectEditableStyles);
  const currentScreenId = useSelector(selectCurrentScreenId);
  const selectedElements = useSelector(selectSelectedElements);
  const [showRemoveGroupDialog, setShowRemoveGroupDialog] = useState(false);
  const [editedStyles, setEditedStyles] = useState<React.CSSProperties | null>(
    null,
  );

  const handleOpenRemovalConfirmModal = useCallback(
    (styles: React.CSSProperties) => {
      setEditedStyles(styles);
      setShowRemoveGroupDialog(true);
    },
    [],
  );

  const handleCloseRemoveConfirmModal = useCallback(() => {
    setShowRemoveGroupDialog(false);
    setEditedStyles(null);
  }, []);

  const handleConfirmSourceUnbinding = () => {
    if (!editedStyles) {
      console.error('Edited styles is null!');
      return;
    }
    dispatch(
      unbindGroupElementStyles(activeElement.id, editedStyles, {
        screenId: currentScreenId,
      }),
    );
    handleCloseRemoveConfirmModal();
  };

  const masterScreenEnabled = useSelector(selectMasterScreenEnabled);

  const isGroupElement = !!activeElement.parameters.sourceElementId;
  const isGroupSource = !!activeElement.parameters.groupElements;

  const elementsControlsCollection = Object.keys(selectedElements).map(
    (elementId) => {
      return AVAILABLE_CONTROLS[selectedElements[elementId].type];
    },
  );

  const SELECTION_CONTROLS = useMemo(() => {
    if (!elementsControlsCollection.length) {
      return [];
    }
    const elementsControls = elementsControlsCollection.reduce(
      (controls, controlsList) => {
        return controls.filter((control) => {
          return (
            controlsList.includes(control) && !UNIQUE_CONTROLS.includes(control)
          );
        });
      },
    );
    return elementsControls;
  }, [elementsControlsCollection]);

  const { type } = activeElement;

  const removeStyles = useCallback(
    (ruleNames: PropertyName[]) => {
      if (!selectedElementsIds.length) {
        dispatch(
          enqueueSnackbar({
            message: 'No elements were selected',
            options: { variant: 'error' },
          }),
        );
      } else if (selectedElementsIds.length > 1) {
        dispatch(
          removeMultipleElementsStyles(selectedElementsIds, ruleNames, {
            screenId: currentScreenId,
          }),
        );
      } else if (masterScreenEnabled) {
        if (isGroupSource) {
          const groupElementsIds = activeElement.parameters.groupElements;
          dispatch(
            removeMultipleElementsStyles(
              [activeElement.id, ...groupElementsIds],
              ruleNames,
              {
                screenId: currentScreenId,
              },
            ),
          );
        } else {
          dispatch(
            removeSharedStyles(editableStyles as Entity, ruleNames, {
              screenId: currentScreenId,
            }),
          );
        }
      } else if (editableStyles === 'ownStyles') {
        dispatch(
          removeElementStyles(activeElement.id, ruleNames, {
            screenId: currentScreenId,
          }),
        );
      } else {
        dispatch(
          removeSharedStyles(editableStyles as Entity, ruleNames, {
            screenId: currentScreenId,
          }),
        );
      }
    },
    [
      selectedElementsIds,
      editableStyles,
      masterScreenEnabled,
      dispatch,
      currentScreenId,
      isGroupSource,
      activeElement.parameters.groupElements,
      activeElement.id,
    ],
  );

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
      } else if (isGroupElement) {
        handleOpenRemovalConfirmModal(styles);
      } else if (editableStyles === 'ownStyles') {
        dispatch(
          updateElementStyles(activeElement.id, styles, {
            screenId: currentScreenId,
          }),
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
      isGroupElement,
      editableStyles,
      dispatch,
      currentScreenId,
      isGroupSource,
      activeElement.parameters.groupElements,
      activeElement.id,
      activeElement.type,
      handleOpenRemovalConfirmModal,
    ],
  );

  const updateParams = useCallback(
    (params: Params<any>, itemID?: string) => {
      dispatch(
        updateElementParameters(itemID || activeElement.id, params, {
          screenId: currentScreenId,
        }),
      );
    },
    [dispatch, activeElement.id, currentScreenId],
  );

  if ([masterCoreElementId, masterGroupsElementId].includes(activeElement.id)) {
    return null;
  }

  return (
    <div className={classes.propertiesTab}>
      <Scrollbar
        autoHeightMin="100%"
        style={{
          height: '100%',
        }}
      >
        {!isPrototypeMode && (
          <>
            {SELECTION_CONTROLS.map((controlName) => {
              if (
                (isFreeCanvasMode && controlName === 'size') ||
                (masterScreenEnabled &&
                  CONTROLS_AFFECT_ON_PARAMS.includes(
                    controlName as typeof CONTROLS_AFFECT_ON_PARAMS[number],
                  ))
              ) {
                return null;
              }
              const controlInfo = CONTROLS[controlName];
              const { Control } = controlInfo;

              return (
                <ControlSection key={controlName} title={controlName}>
                  <Control
                    {...getControlStyles(controlName, currentEditableStyles)}
                    activeElementId={activeElement.id}
                    removeStyles={!masterScreenEnabled && removeStyles}
                    updateStyles={updateStyles}
                    updateParams={!masterScreenEnabled && updateParams}
                    masterScreenEnabled={masterScreenEnabled}
                  />
                </ControlSection>
              );
            })}

            {type !== 'root' &&
              elementsControlsCollection.length === 1 &&
              !masterScreenEnabled && (
                <>
                  {!isGroupElement && (
                    <ControlSection title="Share styles">
                      <ShareStyles />
                    </ControlSection>
                  )}

                  <ControlSection title="Element name">
                    <RenameElement />
                  </ControlSection>
                </>
              )}
          </>
        )}
      </Scrollbar>
      <BasicConfirmForm
        open={showRemoveGroupDialog}
        title="Change styles of a group element"
        onConfirm={handleConfirmSourceUnbinding}
        onClose={handleCloseRemoveConfirmModal}
      >
        By changing styles of a current element, you will not be able to change
        it again from the Master Screen. Do you want to proceed?
      </BasicConfirmForm>
    </div>
  );
};

export default PropertiesTab;
