import React, { ChangeEvent, useState } from 'react';
import { connect } from 'react-redux';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import withStyles from '@material-ui/core/styles/withStyles';
import { actionsCreators, selectors } from '../../redux/project';
import Spinner from '../UI/Spinner';
import { AppReduxState } from '../../shared/types/app';
import PropertiesTab from './PropertiesTab';
import ElementsTab from './ElementsTab';
import { ActiveItem } from '../../redux/project/types';

const styles = require('./styles.scss');

const StyledTabs = withStyles({
  root: {},
  indicator: {
    backgroundColor: '#1cc09f',
  },
})(Tabs);

const StyledTab = withStyles({
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
})(Tab);

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

const mapState = (state: AppReduxState) => ({
  activeItem: selectors.selectActiveElement(state) as ActiveItem,
  isAddElementsModalOpened: selectors.selectIsAddElementsModalOpened(state),
  loader: selectors.selectLoader(state),
});

const mapDispatch = {
  createElements: actionsCreators.createElements,
  setIsAddElementsModalOpened: actionsCreators.setIsAddElementsModalOpened,
};

type PropertiesPanelProps = ReturnType<typeof mapState> & typeof mapDispatch;

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  loader,
  createElements,
  isAddElementsModalOpened,
  activeItem,
  setIsAddElementsModalOpened,
}) => {
  const [tab, setTab] = useState(1);

  const handleChange = (ev: ChangeEvent<{}>, newValue: number) =>
    setTab(newValue);

  return (
    <div className={styles.editorRightPanel}>
      <StyledTabs
        value={tab}
        onChange={handleChange}
        className={styles.tabs}
        variant="fullWidth"
      >
        <StyledTab className={styles.tab} label="Properties" />

        <StyledTab className={styles.tab} label="Elements" />
      </StyledTabs>

      <TabPanel index={0} value={tab}>
        <PropertiesTab
          activeItem={activeItem}
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

export default connect(mapState, mapDispatch)(PropertiesPanel);
