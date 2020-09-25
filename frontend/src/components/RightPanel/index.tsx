import React, { ChangeEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { actionsCreators } from '../../redux/project';
import Spinner from '../UI/Spinner';
import PropertiesTab from './PropertiesTab';
import ElementsTab from './ElementsTab';
import {
  selectActiveElement,
  selectIsAddElementsModalOpened,
  selectLoader,
} from '../../redux/project/selectors';

// const styles = require('./styles.scss');

const styles = {} as any;

const useTabsStyles = makeStyles({
  root: {},
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
  return (
    <div hidden={value !== index} className={styles.tabPanel}>
      {children}
    </div>
  );
};

const PropertiesPanel: React.FC = () => {
  const dispatch = useDispatch();
  const activeElement = useSelector(selectActiveElement);
  const isAddElementsModalOpened = useSelector(selectIsAddElementsModalOpened);
  const loader = useSelector(selectLoader);

  const createElements = (createdElements, meta) =>
    dispatch(actionsCreators.createElements(createdElements, meta));

  const setIsAddElementsModalOpened = (open) =>
    dispatch(actionsCreators.setIsAddElementsModalOpened(open));

  const tabClasses = useTabStyles();
  const tabsClasses = useTabsStyles();

  const [tab, setTab] = useState(0);

  const handleChange = (ev: ChangeEvent<{}>, newValue: number) =>
    setTab(newValue);

  return (
    <div className={styles.editorRightPanel}>
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
        <PropertiesTab
          activeItem={activeElement}
          setIsAddElementsModalOpened={setIsAddElementsModalOpened}
          isAddElementsModalOpened={isAddElementsModalOpened}
          createElements={createElements}
        />
      </TabPanel>

      <TabPanel index={1} value={tab}>
        <ElementsTab />
      </TabPanel>

      <Spinner active={loader} />
    </div>
  );
};

export default PropertiesPanel;
