import React, { ChangeEvent, useState } from 'react';
import { useSelector } from 'react-redux';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Spinner from '../UI/Spinner';
import PropertiesTab from './PropertiesTab';
import ElementsTab from './ElementsTab';
import { selectLoader } from '../../redux/project/selectors';

const useStyles = makeStyles({
  root: {
    width: 300, // right panel width constant
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  tabPanel: {
    flex: 1,
    overflow: 'auto',
  },
});

const useTabsStyles = makeStyles({
  indicator: {
    backgroundColor: '#1cc09f',
  },
});

const useTabStyles = makeStyles({
  root: {
    minWidth: 72,
    '&:hover': {},
    '&$selected': {},
    '&:focus': {},
  },
  selected: {
    borderRadius: '2px 2px 0 0',
    backgroundColor: '#e7e7e7',
  },
});

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

const PropertiesPanel: React.FC = () => {
  const classes = useStyles();
  const loader = useSelector(selectLoader);

  const tabClasses = useTabStyles();
  const tabsClasses = useTabsStyles();

  const [tab, setTab] = useState(0);

  const handleChange = (ev: ChangeEvent<{}>, newValue: number) =>
    setTab(newValue);

  return (
    <div className={classes.root}>
      <Tabs
        value={tab}
        onChange={handleChange}
        classes={tabsClasses}
        variant="fullWidth"
      >
        <Tab classes={tabClasses} label="Properties" />

        <Tab classes={tabClasses} label="Elements" />
      </Tabs>

      <TabPanel index={0} value={tab}>
        <PropertiesTab />
      </TabPanel>

      <TabPanel index={1} value={tab}>
        <ElementsTab />
      </TabPanel>

      <Spinner active={loader} />
    </div>
  );
};

export default PropertiesPanel;
