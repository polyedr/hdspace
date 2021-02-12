import ControlSection from '@Components/RightPanel/PropertiesTab/helperComponents/ControlSection';
import Scrollbar from '@Components/UI/Scrollbar';
import CONTROLS from '@Constants/controls';
import { AVAILABLE_CONTROLS } from '@Domain/core';
import { makeStyles } from '@material-ui/core';
import { selectActiveMasterElement } from '@Redux/project/selectors/masterScreen';
import getControlStyles from '@Utils/getControlStyles';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentEditableStyles } from '@Redux/project/selectors/element';
import { updateSharedStyles } from '@Redux/project/actions';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import { selectEditableStyles } from '@Redux/project/selectors/base';
import { Entity } from '@Src/types';

const useStyles = makeStyles({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
});

const MasterPanel = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const activeMasterElement = useSelector(selectActiveMasterElement);
  const currentEditableStyles = useSelector(selectCurrentEditableStyles);
  const editableStyles = useSelector(selectEditableStyles);
  const screenId = useSelector(selectCurrentScreenId);

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
        {AVAILABLE_CONTROLS[activeMasterElement].map((controlName) => {
          const controlInfo = CONTROLS[controlName];
          const { Control } = controlInfo;

          return (
            <ControlSection key={controlName} title={controlName}>
              <Control
                {...getControlStyles(controlName, currentEditableStyles)}
                activeElementId="none"
                removeStyles={() => console.log('puff')}
                updateStyles={updateStyles}
                updateParams={() => console.log('puff')}
              />
            </ControlSection>
          );
        })}
      </Scrollbar>
    </div>
  );
};

export default MasterPanel;
