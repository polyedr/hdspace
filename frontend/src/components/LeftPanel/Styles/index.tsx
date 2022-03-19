import {
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
} from '@Components/styledComponents';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, { useCallback, useState } from 'react';
import ELEMENT_IDS from '@Constants/elementIds';
import { lighten, makeStyles } from '@material-ui/core/styles';
import ControlSection from '@Components/RightPanel/PropertiesTab/helperComponents/ControlSection';
import sectionTitleEnum from '@Components/LeftPanel/Styles/Enums/sectionTitleEnum';
import CONTROLS from '@Constants/controls';
import getControlStyles from '@Utils/getControlStyles';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectActiveElement,
  selectCurrentEditableStyles,
  selectParentOfActiveElement,
  selectSelectedElementsIds,
} from '@Redux/project/selectors/element';
import { selectIfCurrentUserHasPermission } from '@Redux/permissions/selectors';
import {
  Entity,
  Params,
  PropertyName,
  UserProjectPermission,
} from '@Src/types';
import { enqueueSnackbar } from '@Redux/notification/actions';
import {
  removeElementStyles,
  removeMultipleElementsStyles,
  removeSharedStyles,
  replaceMultipleElementsStyles,
  updateDefaultStyles,
  updateElementParameters,
  updateMultipleElementsParameters,
  updateSharedStyles,
} from '@Redux/project/actions';
import { selectEditableStyles } from '@Redux/project/selectors/base';
import {
  selectCurrentScreenId,
  selectMasterScreenEnabled,
} from '@Redux/project/selectors/screen';
import { ALL_ELEMENTS_INDEX } from '@Constants/defaultParams';
import StyleGenerator from '@Components/LeftPanel/Styles/components/StyleGenerator';
import ColorScheme from '@Components/LeftPanel/Styles/components/ColorScheme';
import CONTROLS_CLASSES from '@Components/LeftPanel/Styles/controlClasses';

const useStyles = makeStyles(({ palette, typography }) => ({
  name: {
    fontSize: typography.fontSize,
  },
  button: {
    color: palette.common.white,
    '&:hover': {
      backgroundColor: lighten(palette.panel.main, 0.1),
    },
  },
  list: {
    width: '100%',
    padding: 0,
    overflowX: 'hidden',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  blockTitle: {
    backgroundColor: palette.panel.main,
    paddingLeft: 3,
  },
}));

const Styles = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const SECTION_CONTROLS = ['indents', 'typography', 'headingType', 'border'];

  const activeElement = useSelector(selectActiveElement);
  const parentOfActiveElement = useSelector(selectParentOfActiveElement);
  const masterScreenEnabled = useSelector(selectMasterScreenEnabled);
  const currentEditableStyles = useSelector(selectCurrentEditableStyles);
  const currentScreenId = useSelector(selectCurrentScreenId);
  const selectedElementsIds = useSelector(selectSelectedElementsIds);
  const editableStyles = useSelector(selectEditableStyles);
  const canEdit = useSelector(
    selectIfCurrentUserHasPermission(UserProjectPermission.CHANGE_PROJECT),
  );
  const [editedStyles, setEditedStyles] = useState<React.CSSProperties | null>(
    null,
  );
  const [showRemoveGroupDialog, setShowRemoveGroupDialog] = useState(false);

  console.log(editedStyles, showRemoveGroupDialog);

  const isGroupElement = !!activeElement.parameters.sourceElementId;
  const isGroupSource = !!activeElement.parameters.groupElements;

  const handleOpenRemovalConfirmModal = useCallback(
    (styles: React.CSSProperties) => {
      setEditedStyles(styles);
      setShowRemoveGroupDialog(true);
    },
    [],
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
    [dispatch, activeElement.id, currentScreenId, parentOfActiveElement],
  );

  const updateStyles = useCallback(
    (styles: React.CSSProperties, controlName: string) => {
      console.log(
        `updateStyles ${JSON.stringify(
          styles,
        )}, controlName: ${controlName}, typeOf styles: ${typeof styles}`,
      );
      dispatch(
        updateDefaultStyles(CONTROLS_CLASSES[controlName], styles, {
          screenId: currentScreenId,
        }),
      );
    },
    [dispatch, currentScreenId],
  );

  const removeStyles = useCallback(
    (ruleNames: PropertyName[]) => {
      console.log('removeStyles');
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
  return (
    <>
      <StyledAccordion defaultExpanded id={ELEMENT_IDS.styles}>
        <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
          <span>Styles</span>
        </StyledAccordionSummary>
        <StyledAccordionDetails className={classes.details}>
          <ControlSection title={sectionTitleEnum.STYLE_GENERATOR}>
            <StyleGenerator />
          </ControlSection>
          {SECTION_CONTROLS.map((controlName) => {
            const controlInfo = CONTROLS[controlName];
            const { Control } = controlInfo;

            if (
              controlName === sectionTitleEnum.TYPOGRAPHY.toLowerCase() ||
              controlName === sectionTitleEnum.BORDER.toLowerCase()
            ) {
              return (
                <ControlSection title={controlName} key={controlName}>
                  <Control
                    {...getControlStyles(controlName, currentEditableStyles)}
                    canEdit={canEdit}
                    activeElementId={activeElement.id}
                    element={activeElement}
                    removeStyles={!masterScreenEnabled && removeStyles}
                    updateStyles={(styles) => updateStyles(styles, controlName)}
                    replaceStyles={replaceStyles}
                    updateParams={!masterScreenEnabled && updateParams}
                    masterScreenEnabled={masterScreenEnabled}
                    editableStyles={editableStyles}
                    isLeftSide
                  />
                </ControlSection>
              );
            }
            return (
              <ControlSection title={controlName} key={controlName}>
                <Control
                  {...getControlStyles(controlName, currentEditableStyles)}
                  canEdit={canEdit}
                  activeElementId={activeElement.id}
                  element={activeElement}
                  removeStyles={!masterScreenEnabled && removeStyles}
                  updateStyles={(styles) => updateStyles(styles, controlName)}
                  replaceStyles={replaceStyles}
                  updateParams={!masterScreenEnabled && updateParams}
                  masterScreenEnabled={masterScreenEnabled}
                  editableStyles={editableStyles}
                />
              </ControlSection>
            );
          })}
          <ControlSection title={sectionTitleEnum.COLOR_SCHEME}>
            <ColorScheme />
          </ControlSection>
        </StyledAccordionDetails>
      </StyledAccordion>
    </>
  );
};

export default Styles;
