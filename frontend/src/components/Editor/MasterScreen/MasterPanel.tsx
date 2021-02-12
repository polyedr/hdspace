import ControlSection from '@Components/RightPanel/PropertiesTab/helperComponents/ControlSection';
import Scrollbar from '@Components/UI/Scrollbar';
import CONTROLS from '@Constants/controls';
import { AVAILABLE_CONTROLS } from '@Domain/core';
import { makeStyles } from '@material-ui/core';
import { selectActiveMasterElement } from '@Redux/project/selectors/masterScreen';
import getControlStyles from '@Utils/getControlStyles';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentEditableStyles } from '@Redux/project/selectors/element';

const useStyles = makeStyles({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
});

const MasterPanel = () => {
  const classes = useStyles();
  const activeMasterElement = useSelector(selectActiveMasterElement);
  const currentEditableStyles = useSelector(selectCurrentEditableStyles);

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
                updateStyles={() => console.log('puff')}
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
