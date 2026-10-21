import ActivityTab from '@Components/Sidebar/Activity';
import TasksTab from '@Components/Sidebar/Board';
import ChatTab from '@Components/Sidebar/ChatDisabled';
import InviteTab from '@Components/Sidebar/Invite';

export enum TABS_PMTOOLS {
  board = 'Board',
  chat = 'Chat',
  members = 'Team',
  activity = 'Activity',
}

export const components = {
  [TABS_PMTOOLS.board]: TasksTab,
  [TABS_PMTOOLS.chat]: ChatTab,
  [TABS_PMTOOLS.members]: InviteTab,
  [TABS_PMTOOLS.activity]: ActivityTab,
};
