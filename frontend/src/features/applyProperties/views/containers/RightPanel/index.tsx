import React, { ChangeEvent, useState } from 'react';
import { connect } from 'react-redux';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import withStyles from '@material-ui/core/styles/withStyles';
import { actionsCreators, selectors } from '../../../../../redux/project';
import Spinner from '../../../../../components/UI/Spinner';
import { AppReduxState } from '../../../../../shared/types/app';
import PropertiesTab from './PropertiesTab';
import Scrollbar from '../../../../../components/UI/Scrollbar';

const styles = require('./PropertiesPanel.scss');

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
    backgroundColor: '#ececec',
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
      {value === index && (
        <Scrollbar autoHeightMin="100%">{children}</Scrollbar>
      )}
    </div>
  );
};

const mapState = (state: AppReduxState) => ({
  activeItem: selectors.selectActiveItem(state),
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
  const [value, setValue] = useState(0);

  const handleChange = (ev: ChangeEvent<{}>, newValue: number) =>
    setValue(newValue);

  return (
    <div className={styles.editorRightPanel}>
      <StyledTabs
        value={value}
        onChange={handleChange}
        className={styles.tabs}
        variant="fullWidth"
      >
        <StyledTab className={styles.tab} label="Properties" />

        <StyledTab className={styles.tab} label="Elements" />
      </StyledTabs>

      <TabPanel index={0} value={value}>
        <PropertiesTab
          activeItem={activeItem}
          setIsAddElementsModalOpened={setIsAddElementsModalOpened}
          isAddElementsModalOpened={isAddElementsModalOpened}
          createElements={createElements}
        />
      </TabPanel>

      <TabPanel index={1} value={value}>
        Elements
      </TabPanel>

      <Spinner active={loader} />
    </div>
  );
};

export default connect(mapState, mapDispatch)(PropertiesPanel);
