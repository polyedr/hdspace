// @ts-nocheck
import React, { memo, useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@mui/styles';
import logger from 'loglevel';
import ToggleButton from '@mui/material/ToggleButton';
import { ToggleButtonGroup } from '@mui/material';
import BasicConfirmForm from '@Components/Forms/BasicConfirmForm';
import {
  selectActiveElement,
  selectCurrentEditableStyles,
  selectMasterCoreElementId,
  selectMasterGroupsElementId,
  selectSelectedElements,
  selectSelectedElementsIds,
  selectParentOfActiveElement,
} from '@Redux/project/selectors/element';
import { selectEditableStyles } from '@Redux/project/selectors/base';
import { selectIsPrototypeMode } from '@Redux/user/selectors';
import { AVAILABLE_CONTROLS } from '@Domain/core';
import {
  CONTROLS_AFFECT_ON_PARAMS,
  CONTROLS_AFFECT_ON_STYLES,
  Entity,
  Params,
  PropertyName,
  UserProjectPermission,
} from '@Src/types';
import {
  removeElementStyles,
  removeMultipleElementsStyles,
  removeSharedStyles,
  replaceMultipleElementsStyles,
  unbindGroupElementStyles,
  updateElementParameters,
  updateMultipleElementsParameters,
  updateMultipleElementsStyles,
  updateSharedStyles,
} from '@Redux/project/actions';
import { enqueueSnackbar } from '@Redux/notification/actions';
import { ALL_ELEMENTS_INDEX, UNIQUE_CONTROLS } from '@Constants/defaultParams';
import {
  selectCurrentScreenId,
  selectFreeCanvasMode,
  selectMasterScreenEnabled,
} from '@Redux/project/selectors/screen';
import CONTROLS from '@Constants/controls';
import getControlStyles from '@Utils/getControlStyles';
import { selectIfCurrentUserHasPermission } from '@Redux/permissions/selectors';

import Scrollbar from '../../UI/Scrollbar';
import RenameElement from './Controls/RenameElement/RenameElement';
import ShareStyles from './helperComponents/ShareStyles/ShareStyles';
import ControlSection from './helperComponents/ControlSection';
import PseudoSelectorsSection from './PseudoSelectorsSection';
import ElementType from './Controls/ElementType/ElementType';

enum PROPERTIES_TYPES {
  SETTINGS = 'settings',
  STYLES = 'styles',
}

enum CollapseTypes {
  COLLAPSE = 'Collapse All',
  EXPAND = 'Expand All',
}

const useStyles = makeStyles({
  propertiesTab: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderLeft: '1px solid #E4E6EB',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 16px',
  },
  toggleButtonsContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  activeToggleButton: {
    color: '#2A2A2D',
    fontWeight: 'bold',
    fontSize: '12px',
    letterSpacing: '145%',
  },
  rightEmptyPanel: {
    color: '#fff',
    height: '100%',
    display: 'flex',
    overflow: 'hidden',
    transition: 'width 250ms ease',
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  toggleButton: {
    color: '#81818E',
    fontWeight: 'bold',
    fontSize: '12px',
    letterSpacing: '145%',
  },
});

const toggleButtonStyles = {
  height: '32px',
  width: '113.5px',
  border: '1px solid #F3F4F6',
  fontWeight: 'bold',
  fontSize: '12px',
  letterSpacing: '145%',
};

const PropertiesTab: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const parentOfActiveElement = useSelector(selectParentOfActiveElement);
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

  const [propertiesType, setPropertiesType] = useState<PROPERTIES_TYPES>(
    PROPERTIES_TYPES.STYLES,
  );

  const [showRemoveGroupDialog, setShowRemoveGroupDialog] = useState(false);
  const [isAccordianExpanded, setIsAccordianExpanded] = useState(true);
  const [title, setTitle] = useState<CollapseTypes>(CollapseTypes.EXPAND);
  const canEdit = useSelector(
    selectIfCurrentUserHasPermission(UserProjectPermission.CHANGE_PROJECT),
  );
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
      logger.error('Edited styles is null!');
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

  const elementsControlsCollection = useMemo(() => {
    return Object.keys(selectedElements)
      .map((elementId) =>
        selectedElements[elementId]?.type
          ? AVAILABLE_CONTROLS[selectedElements[elementId].type]
          : null,
      )
      .filter((item) => item);
  }, [selectedElements, AVAILABLE_CONTROLS]);

  const SELECTION_CONTROLS = useMemo(() => {
    if (!elementsControlsCollection.length) {
      return [];
    }
    const elementsControls = elementsControlsCollection.reduce(
      (controls, controlsList) =>
        controls.filter(
          (control) =>
            controlsList.includes(control) &&
            !UNIQUE_CONTROLS.includes(control),
        ),
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
  const replaceStyles = useCallback(
    (styles: React.CSSProperties) => {
      if (masterScreenEnabled) {
        if (isGroupSource) {
          const groupElementsIds = activeElement.parameters.groupElements;
          dispatch(
            replaceMultipleElementsStyles(
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
          replaceMultipleElementsStyles(
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
          updateMultipleElementsStyles(
            [activeElement.id],
            {
              [ALL_ELEMENTS_INDEX]: styles,
            },
            { screenId: currentScreenId },
          ),
        );
        if (
          parentOfActiveElement &&
          parentOfActiveElement.name === 'generator'
        ) {
          dispatch(
            updateMultipleElementsStyles(
              [...parentOfActiveElement.children],
              {
                [ALL_ELEMENTS_INDEX]: styles,
              },
              { screenId: currentScreenId },
            ),
          );
        }
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
      if (parentOfActiveElement && parentOfActiveElement.name === 'generator') {
        dispatch(
          updateMultipleElementsParameters(
            [...parentOfActiveElement.children],
            { [ALL_ELEMENTS_INDEX]: params },
            {
              screenId: currentScreenId,
            },
          ),
        );
      } else {
        dispatch(
          updateElementParameters(itemID || activeElement.id, params, {
            screenId: currentScreenId,
          }),
        );
      }
    },
    [dispatch, activeElement.id, currentScreenId],
  );

  if (
    !activeElement ||
    [masterCoreElementId, masterGroupsElementId].includes(activeElement.id)
  ) {
    return <div className={classes.rightEmptyPanel}></div>;
  }

  const collapseAll = () => {
    setIsAccordianExpanded(!isAccordianExpanded);
    setTitle((state) =>
      state === CollapseTypes.EXPAND
        ? CollapseTypes.COLLAPSE
        : CollapseTypes.EXPAND,
    );
  };

  return (
    <div className={classes.propertiesTab}>
      <Scrollbar
        autoHeightMin="100%"
        style={{
          height: '100%',
          backgroundColor: '#fff',
        }}
      >
        <div className={classes.header}>
          <div
            style={{
              fontStyle: 'Roboto-Medium',
              color: '#2A2A2D',
              fontWeight: 500,
              fontSize: '16px',
              lineHeight: '145%',
            }}
          >
            Properties
          </div>
          <div
            style={{
              fontStyle: 'Roboto-Regular',
              fontSize: '14px',
              lineHeight: '135%',
              color: '#81818E',
              cursor: 'pointer',
            }}
            onClick={collapseAll}
          >
            {title}
          </div>
        </div>
        {!isPrototypeMode && (
          <>
            <div className={classes.toggleButtonsContainer}>
              <ToggleButtonGroup
                value={propertiesType}
                sx={{ height: '32px', width: '227px' }}
              >
                <ToggleButton
                  value={PROPERTIES_TYPES.STYLES}
                  onClick={() => setPropertiesType(PROPERTIES_TYPES.STYLES)}
                  sx={toggleButtonStyles}
                >
                  {PROPERTIES_TYPES.STYLES}
                </ToggleButton>
                <ToggleButton
                  sx={toggleButtonStyles}
                  value={PROPERTIES_TYPES.SETTINGS}
                  onClick={() => setPropertiesType(PROPERTIES_TYPES.SETTINGS)}
                >
                  {PROPERTIES_TYPES.SETTINGS}
                </ToggleButton>
              </ToggleButtonGroup>
            </div>

            <PseudoSelectorsSection />
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

              if (
                propertiesType === PROPERTIES_TYPES.SETTINGS &&
                CONTROLS_AFFECT_ON_PARAMS.includes(
                  controlName as typeof CONTROLS_AFFECT_ON_PARAMS[number],
                )
              ) {
                return (
                  <ControlSection
                    key={controlName}
                    title={controlName}
                    expanded={isAccordianExpanded}
                  >
                    <Control
                      {...getControlStyles(controlName, currentEditableStyles)}
                      canEdit={canEdit}
                      controlName={controlName}
                      activeElementId={activeElement.id}
                      element={activeElement}
                      removeStyles={!masterScreenEnabled && removeStyles}
                      updateStyles={updateStyles}
                      replaceStyles={replaceStyles}
                      updateParams={!masterScreenEnabled && updateParams}
                      masterScreenEnabled={masterScreenEnabled}
                      editableStyles={editableStyles}
                    />
                  </ControlSection>
                );
              }
              if (
                propertiesType === PROPERTIES_TYPES.STYLES &&
                CONTROLS_AFFECT_ON_STYLES.includes(
                  controlName as typeof CONTROLS_AFFECT_ON_STYLES[number],
                )
              ) {
                return (
                  <ControlSection
                    key={controlName}
                    title={controlName}
                    expanded={isAccordianExpanded}
                  >
                    <Control
                      {...getControlStyles(controlName, currentEditableStyles)}
                      canEdit={canEdit}
                      controlName={controlName}
                      activeElementId={activeElement.id}
                      element={activeElement}
                      removeStyles={!masterScreenEnabled && removeStyles}
                      updateStyles={updateStyles}
                      replaceStyles={replaceStyles}
                      updateParams={!masterScreenEnabled && updateParams}
                      masterScreenEnabled={masterScreenEnabled}
                      editableStyles={editableStyles}
                    />
                  </ControlSection>
                );
              }
              return null;
            })}
          </>
        )}
        {propertiesType === PROPERTIES_TYPES.SETTINGS &&
          type !== 'root' &&
          elementsControlsCollection.length === 1 &&
          !masterScreenEnabled && (
            <>
              {!isGroupElement && (
                <ControlSection
                  title="Share styles"
                  expanded={isAccordianExpanded}
                >
                  <ShareStyles />
                </ControlSection>
              )}

              <ControlSection
                title="Element name"
                expanded={isAccordianExpanded}
              >
                <RenameElement canEdit={canEdit} />
              </ControlSection>

              {!isFreeCanvasMode && (
                <ControlSection
                  title="Replace this element"
                  expanded={isAccordianExpanded}
                >
                  <ElementType />
                </ControlSection>
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

export default memo(PropertiesTab);
