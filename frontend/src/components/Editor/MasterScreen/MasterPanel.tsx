import { makeStyles } from '@mui/styles';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import logger from 'loglevel';
import ControlSection from '@Components/RightPanel/PropertiesTab/helperComponents/ControlSection';
import Scrollbar from '@Components/UI/Scrollbar';
import CONTROLS from '@Constants/controls';
import { AVAILABLE_CONTROLS } from '@Domain/core';
import {
  selectActiveElement,
  selectSharedStyles,
} from '@Redux/project/selectors/element';
import { updateSharedStyles } from '@Redux/project/actions';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import { selectEditableStyles } from '@Redux/project/selectors/base';
import { CONTROLS_AFFECT_ON_PARAMS, Entity } from '@Src/types';

const useStyles = makeStyles({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
});

function MasterPanel() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const activeElement = useSelector(selectActiveElement);
  const editableStyles = useSelector(selectEditableStyles);
  const screenId = useSelector(selectCurrentScreenId);

  const { id, type } = activeElement;
  const sharedStyles = useSelector(
    selectSharedStyles(
      activeElement.type === 'none' ? 'root' : activeElement.type,
    ),
  );

  const updateStyles = (styles: React.CSSProperties) => {
    dispatch(
      updateSharedStyles(editableStyles as Entity, styles, { screenId }),
    );
  };

  return (
    <div className={classes.root}>
      <Scrollbar
        autoHeightMin="100%"
        style={{
          height: '100%',
        }}
      >
        {AVAILABLE_CONTROLS[type].map((controlName) => {
          if (
            CONTROLS_AFFECT_ON_PARAMS.includes(
              controlName as typeof CONTROLS_AFFECT_ON_PARAMS[number],
            )
          ) {
            return null;
          }
          const controlInfo = CONTROLS[controlName];
          const { Control } = controlInfo;

          return (
            <ControlSection key={controlName} title={controlName} expanded>
              <Control
                {...sharedStyles}
                activeElementId={id}
                removeStyles={() => logger.debug('removeStyles call')}
                updateStyles={updateStyles}
                updateParams={() => logger.debug('updateParams call')}
              />
            </ControlSection>
          );
        })}
      </Scrollbar>
    </div>
  );
}

export default MasterPanel;
