import React, { ChangeEvent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { selectIsPrototypeMode } from '@Redux/user/selectors';
import { RIGHT_PANEL_WIDTH } from '@Src/styles/Theme';
import { RightPanelTab } from '@Src/types';
import { selectActiveElement } from '@Redux/project/selectors/element';
import { KEEP_RP_TAB_ELEMENTS } from '@Constants/defaultParams';
import PropertiesTab from './PropertiesTab';
import ElementsTab from './ElementsTab';

const useStyles = makeStyles(({ palette }) => ({
  root: {
    width: (props: any) => (props.open ? RIGHT_PANEL_WIDTH : 0),
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    transition: 'width 0.25s ease',
    backgroundColor: palette.panel.main,
    color: palette.common.white,
  },
  tabPanel: {
    flex: 1,
    overflow: 'auto',
  },
}));

const useTabsStyles = makeStyles(({ palette }) => ({
  root: {},
  indicator: {
    backgroundColor: palette.secondary.main,
  },
}));

const useTabStyles = makeStyles(({ palette }) => ({
  root: {
    minWidth: 72,
    fontWeight: 'bold',
    '&:hover': {},
    '&$selected': {},
    '&:focus': {},
  },
  selected: {
    borderRadius: '2px 2px 0 0',
    backgroundColor: palette.panel.light,
  },
}));

type TabPanelProps = {
  children?: React.ReactNode;
  index: number;
  value: number;
};

const TabPanel: React.FC<TabPanelProps> = ({ value, index, children }) => {
  const classes = useStyles();

  return (
    <div hidden={value !== index} className={classes.tabPanel}>
      {children}
    </div>
  );
};

const RightPanel: React.FC = () => {
  const isPrototypeMode = useSelector(selectIsPrototypeMode);
  const classes = useStyles({ open: !isPrototypeMode });
  const activeElement = useSelector(selectActiveElement);
  const tabClasses = useTabStyles();
  const tabsClasses = useTabsStyles();

  const [activeTab, setActiveTab] = useState(RightPanelTab.ELEMENTS);

  useEffect(() => {
    if (!KEEP_RP_TAB_ELEMENTS.includes(activeElement.type)) {
      setActiveTab(RightPanelTab.PROPERTIES);
    }
  }, [activeElement.type]);

  const handleChange = (ev: ChangeEvent<{}>, tab: number) => {
    setActiveTab(tab);
  };

  return (
    <div className={classes.root}>
      <Tabs
        value={activeTab}
        onChange={handleChange}
        classes={tabsClasses}
        variant="fullWidth"
      >
        <Tab classes={tabClasses} label="Properties" />

        <Tab classes={tabClasses} label="Elements" />
      </Tabs>

      <TabPanel index={RightPanelTab.PROPERTIES} value={activeTab}>
        <PropertiesTab />
      </TabPanel>

      <TabPanel index={RightPanelTab.ELEMENTS} value={activeTab}>
        <ElementsTab />
      </TabPanel>
    </div>
  );
};

export default RightPanel;
