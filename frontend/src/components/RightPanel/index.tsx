import React, { ChangeEvent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Tabs, Tab, IconButton } from '@material-ui/core';
import {
  selectIsPrototypeMode,
  selectUserProfileDataParameters,
} from '@Redux/user/selectors';
import {
  PANEL_TRANSITION_DURATION,
  RIGHT_PANEL_WIDTH,
  RIGHT_PANEL_WIDTH_MIN,
} from '@Src/styles/Theme';
import { RPTab, UserProjectPermission } from '@Src/types';
import {
  selectActiveElement,
  selectActiveElementId,
  selectMasterCoreElementId,
  selectMasterGroupsElementId,
} from '@Redux/project/selectors/element';
import { KEEP_RP_TAB_ELEMENTS } from '@Constants/defaultParams';
import { canElementHaveAllChildren } from '@Utils/AvailableChildrenHelper';
import EventsTab from '@Components/RightPanel/EventsTab';
import { CORE_MASTER_ELEMENTS_IDS } from '@Components/Editor/MasterScreen/coreElements';
import ELEMENT_IDS from '@Constants/elementIds';
import { selectIfCurrentUserHasPermission } from '@Redux/permissions/selectors';
import {
  makeStyles,
  Theme,
  createStyles,
  lighten,
} from '@material-ui/core/styles';

import {
  selectCurrentScreenId,
  selectMasterScreenId,
} from '@Redux/project/selectors/screen';
import VerticalAlignTopIcon from '@material-ui/icons/VerticalAlignTop';
import PropertiesTab from './PropertiesTab';
import ElementsTab from './ElementsTab';
import VariablesTab from './VariablesTab';

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
const useRightPanelStyles = makeStyles<Theme, { isRightPanelOpen: boolean }>(
  ({ palette }) =>
    createStyles({
      root: {
        maxHeight: '100%',
        width: ({ isRightPanelOpen }) =>
          isRightPanelOpen ? RIGHT_PANEL_WIDTH_MIN : RIGHT_PANEL_WIDTH,
        backgroundColor: palette.panel.main,
        transition: `width ${PANEL_TRANSITION_DURATION}ms ease`,
      },
      content: {
        overflowX: 'hidden', // Custom scrollbars bug
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      },
      toggleButton: {
        top: ({ isRightPanelOpen }) => (isRightPanelOpen ? '94%' : '0%'),
        alignSelf: 'flex-start',
        color: palette.common.white,
        '&:hover': {
          backgroundColor: lighten(palette.panel.main, 0.1),
        },
        '& svg': {
          transform: ({ isRightPanelOpen }) =>
            `rotate(${isRightPanelOpen ? -90 : 90}deg)`,
          transition: 'transform 0.25s ease',
        },
      },
    }),
);
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
  Variables: <VariablesTab />,
};

const RightPanel: React.FC = () => {
  const [isRightPanelOpen, setRightPanelOpen] = useState(false);
  const classesRightButton = useRightPanelStyles({ isRightPanelOpen });

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
  const masterScreenId = useSelector(selectMasterScreenId);
  const currentScreenId = useSelector(selectCurrentScreenId);

  const { autoSwitchTabs: tabsAutoswitchEnabled } = useSelector(
    selectUserProfileDataParameters,
  );

  const [tabs, setTabs] = useState(defaultTabs);

  const [activeTabIndex, setActiveTabIndex] = useState<number>(
    tabs.indexOf(RPTab.Properties),
  );

  useEffect(() => {
    setActiveTabIndex(0);
    const isFertile = canElementHaveAllChildren(activeElement.type);

    let newTabs = defaultTabs;
    newTabs = newTabs.filter((tab) => tab !== RPTab.Events);

    if (currentScreenId !== masterScreenId) {
      newTabs = newTabs.filter((tab) => tab !== RPTab.Variables);
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
    currentScreenId,
    masterCoreElId,
    masterGroupsElId,
    masterScreenId,
  ]);

  useEffect(() => {
    if (
      KEEP_RP_TAB_ELEMENTS.includes(activeElement.type) &&
      ![masterCoreElId, masterGroupsElId, ...CORE_MASTER_ELEMENTS_IDS].includes(
        activeElementId,
      ) &&
      canEditProject &&
      !tabsAutoswitchEnabled
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
    tabsAutoswitchEnabled,
  ]);

  const handleChange = (ev: ChangeEvent<{}>, index: number) => {
    setActiveTabIndex(index);
  };

  return (
    <div
      className={
        isRightPanelOpen && isPrototypeMode
          ? classes.root
          : !isRightPanelOpen
          ? classes.root
          : classesRightButton.root
      }
      id={ELEMENT_IDS.rightPanel}
    >
      <div className={classesRightButton.content}>
        {!isRightPanelOpen && (
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
        )}
        <IconButton
          className={classesRightButton.toggleButton}
          onClick={() => setRightPanelOpen(!isRightPanelOpen)}
          title={`${isRightPanelOpen ? 'Open' : 'Hide'} panel`}
        >
          <VerticalAlignTopIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default RightPanel;
