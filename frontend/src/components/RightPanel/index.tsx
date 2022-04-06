import React, { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tabs, Tab, IconButton } from '@material-ui/core';
import {
  selectIsPrototypeMode,
  selectIsRightPanelMinimized,
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
import { changeMinRPanel } from '@Redux/user/actions';
import VerticalAlignTopIcon from '@material-ui/icons/VerticalAlignTop';
import { setBordersEnabled } from '@Redux/project/actions';
import { useDebouncedCallback } from 'use-debounce';
import PropertiesTab from './PropertiesTab';
import ElementsTab from './ElementsTab';
import VariablesTab from './VariablesTab';
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
const useRightPanelStyles = makeStyles<Theme, { minimized: boolean }>(
  ({ palette }) =>
    createStyles({
      root: {
        maxHeight: '100%',
        width: ({ minimized }) =>
          minimized ? RIGHT_PANEL_WIDTH_MIN : RIGHT_PANEL_WIDTH,
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
        alignSelf: 'flex-start',
        color: palette.common.white,
        '&:hover': {
          backgroundColor: lighten(palette.panel.main, 0.1),
        },
        '& svg': {
          transform: ({ minimized }) => `rotate(${minimized ? -90 : 90}deg)`,
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
  const dispatch = useDispatch();
  const minimized = useSelector(selectIsRightPanelMinimized);
  const classesRightButton = useRightPanelStyles({ minimized });

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
  const enableBordersDebounce = useDebouncedCallback(() => {
    dispatch(setBordersEnabled(true));
  }, PANEL_TRANSITION_DURATION + 120);

  const togglRightPanel = () => {
    dispatch(setBordersEnabled(false));
    dispatch(changeMinRPanel());
    enableBordersDebounce.callback();
  };
  return (
    <div
      className={
        minimized && isPrototypeMode
          ? classes.root
          : !minimized
          ? classes.root
          : classesRightButton.root
      }
      id={ELEMENT_IDS.rightPanel}
    >
      <div className={classesRightButton.content}>
        {!minimized && (
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
            <AssetsSection />
          </>
        )}
        <IconButton
          className={classesRightButton.toggleButton}
          onClick={togglRightPanel}
          title={`${minimized ? 'Open' : 'Hide'} panel`}
          style={{ top: minimized ? '94%' : '0%' }}
        >
          <VerticalAlignTopIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default RightPanel;
