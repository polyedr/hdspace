import { makeStyles } from '@material-ui/core/styles';
import {
  selectCurrentProjectId,
  selectSidebarOpen,
} from '@Redux/project/selectors/base';
import React, { FC, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import { Tabs, Tab } from '@material-ui/core';
import { TabPanel } from '@Components/styledComponents';
import { components, TABS_PMTOOLS } from '@Constants/pmtools/tabsNamesSidebar';
import { IMessageZulip } from '@Src/types/pmtools/types';
import { selectMessagesZulip } from '@Redux/pmtools/chat/selectors';

const useTabStyles = makeStyles(({ palette }) => ({
  root: {
    minWidth: 72,
    fontWeight: 'bold',
    flex: 1,
  },
  selected: {
    borderRadius: '2px 2px 0 0',
    backgroundColor: palette.panel.light,
  },
}));

const useStyles = makeStyles(({ palette }) => ({
  wrapper: {
    background: '#fff',
    position: 'absolute',
    top: 0,
    width: 0,
    right: 0,
    bottom: 0,
    transition: 'width .3s ease',
    overflow: 'hidden',
    zIndex: 10,
  },
  root: {
    color: palette.common.white,
    backgroundColor: palette.panel.main,
    minHeight: '100%',
    overflowY: 'auto',
    maxHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  open: {
    width: 310,
  },
  panel: {
    flex: 1,
    overflowY: 'auto',
    marginBottom: 90,
  },
}));

const SideModule: FC = () => {
  const messages: Array<IMessageZulip> = useSelector(selectMessagesZulip);
  const classes = useStyles();
  const tabClasses = useTabStyles();
  const open = useSelector(selectSidebarOpen);
  const projectId = useSelector(selectCurrentProjectId);
  const [selectedTabNumber, setSelectedTabNumber] = useState(0);

  useEffect(() => {
    const tabEl = document.getElementById('simple-tabpanel-0');
    if (tabEl) {
      tabEl.scrollTo({
        top: tabEl.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  if (projectId === -1) {
    return <p>Loading... </p>;
  }

  return (
    <div className={cn(classes.wrapper, open && classes.open)}>
      <div className={classes.root} data-testid="sidebar-container">
        <Tabs
          value={selectedTabNumber}
          onChange={(e, v) => setSelectedTabNumber(v)}
        >
          {Object.values(TABS_PMTOOLS).map((tab) => (
            <Tab
              data-testid={`${tab}-tab`}
              label={tab}
              key={tab}
              classes={tabClasses}
              title={tab}
            />
          ))}
        </Tabs>
        {Object.values(TABS_PMTOOLS).map((tab, idx) => {
          const Tab = components[tab];
          return (
            <TabPanel
              value={selectedTabNumber}
              panelClass={classes.panel}
              key={tab}
              index={idx}
            >
              <Tab />
            </TabPanel>
          );
        })}
      </div>
    </div>
  );
};

export default SideModule;
