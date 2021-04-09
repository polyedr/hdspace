import React, { ChangeEvent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Theme } from '@material-ui/core';
import { selectIsPrototypeMode } from '@Redux/user/selectors';
import {
  PANEL_TRANSITION_DURATION,
  RIGHT_PANEL_WIDTH,
} from '@Src/styles/Theme';
import { RPTab, UserProjectPermission } from '@Src/types';
import {
  selectActiveElement,
  selectActiveElementId,
  selectMasterCoreElementId,
  selectMasterGroupsElementId,
} from '@Redux/project/selectors/element';
import {
  INTERACTIVE_ELEMENTS,
  KEEP_RP_TAB_ELEMENTS,
} from '@Constants/defaultParams';
import { canElementHaveAllChildren } from '@Utils/AvailableChildrenHelper';
import EventsTab from '@Components/RightPanel/EventsTab';
import { CORE_MASTER_ELEMENTS_IDS } from '@Components/Editor/MasterScreen/coreElements';
import ELEMENT_IDS from '@Constants/elementIds';
import { selectIfCurrentUserHasPermission } from '@Redux/permissions/selectors';
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

const defaultTabs: RPTab[] = Object.keys(RPTab).map((k) => RPTab[k]);

const tabContent: Record<RPTab, any> = {
  Elements: <ElementsTab />,
  Properties: <PropertiesTab />,
  Events: <EventsTab />,
};

const RightPanel: React.FC = () => {
  const isPrototypeMode = useSelector(selectIsPrototypeMode);
  const activeElement = useSelector(selectActiveElement);
  const activeElementId = useSelector(selectActiveElementId);

  const classes = useStyles({ open: !isPrototypeMode });
  const tabClasses = useTabStyles();
  const tabsClasses = useTabsStyles();
  const masterCoreElId = useSelector(selectMasterCoreElementId);
  const masterGroupsElId = useSelector(selectMasterGroupsElementId);
  const canEditProject = useSelector(
    selectIfCurrentUserHasPermission(UserProjectPermission.CHANGE_PROJECT),
  );

  const [tabs, setTabs] = useState(defaultTabs);

  const [activeTabIndex, setActiveTabIndex] = useState<number>(
    tabs.indexOf(RPTab.Properties),
  );

  useEffect(() => {
    setActiveTabIndex(0);
    const isInteractive = INTERACTIVE_ELEMENTS.includes(activeElement.type);
    const isFertile = canElementHaveAllChildren(activeElement.type);

    let newTabs = defaultTabs;
    if (!isInteractive || !canEditProject) {
      newTabs = newTabs.filter((tab) => tab !== RPTab.Events);
    }
    if (
      !isFertile ||
      [masterCoreElId, masterGroupsElId, ...CORE_MASTER_ELEMENTS_IDS].includes(
        activeElement.id,
      ) ||
      !canEditProject
    ) {
      newTabs = newTabs.filter((tab) => tab !== RPTab.Elements);
    }

    setTabs(newTabs);
  }, [
    activeElement.id,
    activeElement.type,
    canEditProject,
    masterCoreElId,
    masterGroupsElId,
  ]);

  useEffect(() => {
    if (
      KEEP_RP_TAB_ELEMENTS.includes(activeElement.type) &&
      ![masterCoreElId, masterGroupsElId, ...CORE_MASTER_ELEMENTS_IDS].includes(
        activeElementId,
      ) &&
      canEditProject
    ) {
      const index = tabs.indexOf(RPTab.Elements);
      // eslint-disable-next-line no-bitwise
      if (~index) {
        setActiveTabIndex(index);
      }
    }
  }, [
    tabs,
    activeElement.type,
    activeElementId,
    masterCoreElId,
    masterGroupsElId,
    canEditProject,
  ]);

  const handleChange = (ev: ChangeEvent<{}>, index: number) => {
    setActiveTabIndex(index);
  };

  return (
    <div className={classes.root} id={ELEMENT_IDS.rightPanel}>
      <>
        <Tabs
          value={activeTabIndex}
          onChange={handleChange}
          classes={tabsClasses}
          variant="fullWidth"
        >
          {tabs.map((tab) => (
            <Tab key={tab} classes={tabClasses} label={tab} />
          ))}
        </Tabs>

        {tabs.map((tab, i) => {
          return (
            <TabPanel index={i} value={activeTabIndex} key={tab}>
              {tabContent[tab]}
            </TabPanel>
          );
        })}
      </>
      <AssetsSection />
    </div>
  );
};

export default RightPanel;
