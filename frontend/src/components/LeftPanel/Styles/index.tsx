import {
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
} from '@Components/styledComponents';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, { useCallback } from 'react';
import ELEMENT_IDS from '@Constants/elementIds';
import { lighten, makeStyles } from '@material-ui/core/styles';
import ControlSection from '@Components/RightPanel/PropertiesTab/helperComponents/ControlSection';
import sectionTitleEnum from '@Components/LeftPanel/Styles/Enums/sectionTitle';
import CONTROLS from '@Constants/controls';
import getControlStyles from '@Utils/getControlStyles';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectActiveElement,
  selectCurrentEditableStyles,
} from '@Redux/project/selectors/element';
import { selectIfCurrentUserHasPermission } from '@Redux/permissions/selectors';
import { Params, UserProjectPermission } from '@Src/types';
import {
  updateDefaultStyles,
  updateElementParameters,
} from '@Redux/project/actions';
import { selectEditableStyles } from '@Redux/project/selectors/base';
import {
  selectCurrentScreenId,
  selectMasterScreenEnabled,
} from '@Redux/project/selectors/screen';
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
    bottom: 0,
    flexDirection: 'column',
  },
  blockTitle: {
    backgroundColor: palette.panel.main,
    paddingLeft: 3,
  },
}));

const SECTION_CONTROLS = ['indents', 'typography', 'headingType', 'border'];

const Styles = () => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const activeElement = useSelector(selectActiveElement);
  const masterScreenEnabled = useSelector(selectMasterScreenEnabled);
  const currentEditableStyles = useSelector(
    selectCurrentEditableStyles,
  ) as React.CSSProperties;
  const currentScreenId = useSelector(selectCurrentScreenId);
  const editableStyles = useSelector(selectEditableStyles);
  const canEdit = useSelector(
    selectIfCurrentUserHasPermission(UserProjectPermission.CHANGE_PROJECT),
  );

  const updateParams = useCallback(
    (params: Params<any>, itemId?: string) => {
      dispatch(
        updateElementParameters(itemId || activeElement.id, params, {
          screenId: currentScreenId,
        }),
      );
    },
    [activeElement.id, currentScreenId],
  );

  const updateStyles = useCallback(
    (styles: React.CSSProperties, controlName: string) => {
      dispatch(
        updateDefaultStyles(
          CONTROLS_CLASSES[controlName],
          styles,
          controlName,
          {
            screenId: currentScreenId,
          },
        ),
      );
    },
    [dispatch, currentScreenId],
  );

  return (
    <>
      <ControlSection title={sectionTitleEnum.STYLE_GENERATOR} expanded>
        <StyleGenerator />
      </ControlSection>
      {SECTION_CONTROLS.map((controlName) => {
        const controlInfo = CONTROLS[controlName];
        const { Control } = controlInfo;

        return (
          <ControlSection title={controlName} key={controlName} expanded>
            <Control
              {...getControlStyles(controlName, currentEditableStyles)}
              canEdit={canEdit}
              activeElementId={activeElement.id}
              element={activeElement}
              updateStyles={(styles) => updateStyles(styles, controlName)}
              masterScreenEnabled={masterScreenEnabled}
              editableStyles={editableStyles}
              updateParams={updateParams}
              isDefaultStyles
            />
          </ControlSection>
        );
      })}
      <ControlSection title={sectionTitleEnum.COLOR_SCHEME} expanded>
        <ColorScheme />
      </ControlSection>
    </>
  );
};

export default Styles;
