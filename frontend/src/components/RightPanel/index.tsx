import React from 'react';
import { useSelector } from 'react-redux';
import { selectIsPrototypeMode } from '@Redux/user/selectors';
import {
  PANEL_TRANSITION_DURATION,
  RIGHT_PANEL_WIDTH,
} from '@Src/styles/Theme';

import ELEMENT_IDS from '@Constants/elementIds';
import { makeStyles, Theme } from '@material-ui/core/styles';

import PropertiesTab from './PropertiesTab';
import ElementsTab from './ElementsTab';
import AssetsSection from './Assets';

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
  const classes = useStyles({ open: !isPrototypeMode });

  return (
    <div className={classes.root} id={ELEMENT_IDS.rightPanel}>
      {/* <Tabs
              value={activeTabIndex}
              onChange={handleChange}
              classes={tabsClasses}
              variant="fullWidth"
            >
              {tabs.map((tab) => (
                <Tab key={tab} classes={tabClasses} label={tab} />
              ))}
            </Tabs> */}

      {/* {tabs.map((tab, i) => {
              return (
                <TabPanel index={i} value={activeTabIndex} key={tab}>
                  {tabContent[tab]}
                </TabPanel>
              );
            })} */}
      <PropertiesTab />
      <ElementsTab />
      <AssetsSection />
    </div>
  );
};

export default RightPanel;
