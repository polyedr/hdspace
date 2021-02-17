import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  selectActiveElement,
  selectCurrentEditableStyles,
  selectSelectedElements,
  selectSelectedElementsIds,
} from '@Redux/project/selectors/element';
import {
  selectEditableStyles,
  selectFreeCanvasMode,
} from '@Redux/project/selectors/base';
import { selectIsPrototypeMode } from '@Redux/user/selectors';
import { AVAILABLE_CONTROLS } from '@Domain/core';
import { Entity, Params, PropertyName } from '@Src/types';
import {
  removeElementStyles,
  removeMultipleElementsStyles,
  removeSharedStyles,
  updateElementParameters,
  updateElementStyles,
  updateMultipleElementsStyles,
  updateSharedStyles,
} from '@Redux/project/actions';
import { enqueueSnackbar } from '@Redux/notification/actions';
import { ALL_ELEMENTS_INDEX, UNIQUE_CONTROLS } from '@Constants/defaultParams';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
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
  const selectedElementsIds = useSelector(selectSelectedElementsIds);
  const isFreeCanvasMode = useSelector(selectFreeCanvasMode);
  const isPrototypeMode = useSelector(selectIsPrototypeMode);
  const currentEditableStyles = useSelector(selectCurrentEditableStyles);
  const editableStyles = useSelector(selectEditableStyles);
  const currentScreenId = useSelector(selectCurrentScreenId);
  const selectedElements = useSelector(selectSelectedElements);

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
    if (isGroupElement && selectedElementsIds.length === 1) {
      return elementsControls.filter((control) =>
        UNIQUE_CONTROLS.includes(control),
      );
    }
    return elementsControls;
  }, [elementsControlsCollection, isGroupElement, selectedElementsIds.length]);

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
      } else if (editableStyles === 'ownStyles') {
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
            removeElementStyles(activeElement.id, ruleNames, {
              screenId: currentScreenId,
            }),
          );
        }
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
      } else if (editableStyles === 'ownStyles') {
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
        }
        dispatch(
          updateElementStyles(activeElement.id, styles, {
            screenId: currentScreenId,
          }),
        );
      } else {
        dispatch(
          updateSharedStyles(editableStyles as Entity, styles, {
            screenId: currentScreenId,
          }),
        );
      }
    },
    [
      selectedElementsIds,
      editableStyles,
      dispatch,
      currentScreenId,
      isGroupSource,
      activeElement.id,
      activeElement.parameters,
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
              if (isFreeCanvasMode && controlName === 'size') {
                return null;
              }
              const controlInfo = CONTROLS[controlName];
              const { Control } = controlInfo;

              return (
                <ControlSection key={controlName} title={controlName}>
                  <Control
                    {...getControlStyles(controlName, currentEditableStyles)}
                    activeElementId={activeElement.id}
                    removeStyles={removeStyles}
                    updateStyles={updateStyles}
                    updateParams={updateParams}
                  />
                </ControlSection>
              );
            })}

            {type !== 'root' && elementsControlsCollection.length === 1 && (
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
    </div>
  );
};

export default PropertiesTab;
