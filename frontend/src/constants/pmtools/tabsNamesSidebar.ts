import ActivityTab from '@Components/Sidebar/Activity';
import TasksTab from '@Components/Sidebar/Board';
import ChatTab from '@Components/Sidebar/Chat';
import InviteTab from '@Components/Sidebar/Invite';

export enum TABS_PMTOOLS {
  chat = 'Chat',
  board = 'Board',
  activity = 'Activity',
  members = 'Team',
}

export const components = {
  [TABS_PMTOOLS.chat]: ChatTab,
  [TABS_PMTOOLS.board]: TasksTab,
  [TABS_PMTOOLS.activity]: ActivityTab,
  [TABS_PMTOOLS.members]: InviteTab,
};
