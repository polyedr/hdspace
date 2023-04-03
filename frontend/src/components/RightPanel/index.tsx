import React from 'react';
import { useSelector } from 'react-redux';
import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { selectIsPrototypeMode } from '@Redux/user/selectors';
import {
  PANEL_TRANSITION_DURATION,
  RIGHT_PANEL_WIDTH,
} from '@Src/styles/Theme';
// import { selectActiveElement } from '@Redux/project/selectors/element';
import ELEMENT_IDS from '@Constants/elementIds';
// import { isAvailableChild } from '@Utils/AvailableChildrenHelper';
import PropertiesTab from './PropertiesTab';
// import ElementsTab from './ElementsTab';

const useStyles = makeStyles<Theme>(({ palette }) => ({
  root: {
    width: (props: any) => (props.open ? RIGHT_PANEL_WIDTH : 0),
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    transition: `width ${PANEL_TRANSITION_DURATION}ms ease`,
    backgroundColor: palette.panel.main,
    color: palette.common.white,
    overflow: 'hidden',
  },
  tabPanel: {
    flex: 1,
    overflow: 'auto',
  },
}));

const RightPanel: React.FC = () => {
  const isPrototypeMode = useSelector(selectIsPrototypeMode);
  // const activeElement = useSelector(selectActiveElement);
  const classes = useStyles({ open: !isPrototypeMode });
  return (
    <div className={classes.root} id={ELEMENT_IDS.rightPanel}>
      <PropertiesTab />
      {/* {isAvailableChild(activeElement, activeElement.type) ? (
        <ElementsTab />
      ) : null} */}
    </div>
  );
};

export default RightPanel;
