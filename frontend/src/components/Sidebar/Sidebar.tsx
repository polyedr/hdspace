import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { Tabs, Tab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { TabPanel } from '@Components/styledComponents';
import { fetchMembersAction } from '@Redux/pmtools/invite/actions';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentProjectId } from '@Redux/project/selectors/base';
import { selectTokenPair } from '@Redux/user/selectors';
import ChatTab from './Chat';
import ActivityTab from './Activity';
import TasksTab from './Tasks';
import InviteTab from './Invite';

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
  root: {
    color: palette.common.white,
    backgroundColor: palette.panel.main,
    // paddingBottom: 10,
    minHeight: '100vh',
  },
}));

const Sidebar: FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const tabClasses = useTabStyles();
  const projectId = useSelector(selectCurrentProjectId);
  const [tab, setTab] = useState(0);
  const { access } = useSelector(selectTokenPair);

  const handleSwitchTab = (e: ChangeEvent<{}>, newValue: number) => {
    setTab(newValue);
  };

  useEffect(() => {
    dispatch(fetchMembersAction({ projectId, access }));
  }, [access, dispatch, projectId]);

  return (
    <div data-testid="sidebar-container" className={classes.root}>
      <Tabs value={tab} onChange={handleSwitchTab}>
        <Tab
          data-testid="chat-tab"
          classes={tabClasses}
          label="Chat"
          title="Chat"
        />

        <Tab
          data-testid="tasks-tab"
          classes={tabClasses}
          label="Tasks"
          title="Tasks"
        />

        <Tab
          data-testid="activity-tab"
          classes={tabClasses}
          label="Activity"
          title="Activity"
        />

        <Tab
          data-testid="invite-tab"
          classes={tabClasses}
          label="Members"
          title="Members"
        />
      </Tabs>

      <TabPanel value={tab} index={0}>
        <ChatTab />
      </TabPanel>

      <TabPanel value={tab} index={1}>
        <TasksTab />
      </TabPanel>

      <TabPanel value={tab} index={2}>
        <ActivityTab />
      </TabPanel>

      <TabPanel value={tab} index={3}>
        <InviteTab />
      </TabPanel>
    </div>
  );
};

export default Sidebar;
