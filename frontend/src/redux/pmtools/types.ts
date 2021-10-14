import {
  ActionTypePM,
  ChatLoginData,
  ColumnData,
  MemberData,
  TaskData,
} from '@Src/types/pmtools/types';
import { ServerUserData } from '@Src/types/types';
import { DefaultRootState } from 'react-redux';
import { AuthParams } from '@Src/types/pmtools/actions';
import * as actionsActivity from './activity/actions';
import * as actionsColumns from './board/actions/columns';
import * as actionsTasks from './board/actions/tasks';
import * as actionsSearch from './invite/actions';
import * as actionsInvite from './invite/actions/members';
import sidePanelError from './invite/actions/error';
import { successLoginChatUser, successLogoutChatUser } from './chat/actions';

export interface InviteRootState extends DefaultRootState {
  invite: InviteState;
}

export interface BoardRootState extends DefaultRootState {
  board: BoardState;
}

export interface ActivityRootState extends DefaultRootState {
  activity: ActivityState;
}
export interface ChatRootState extends DefaultRootState {
  chat: ChatState;
}

export type ActivityState = {
  actions: Array<ActionTypePM>;
};

export type ChatState = {
  client: ChatLoginData | null;
};

export type BoardState = {
  columnList: ColumnData[];
  taskList: TaskData[];
};

export type InviteState = {
  members: Array<MemberData>;
  searchResult: any;
  loaderSearch: boolean;
  msg: string;
};

export type UserState = {
  userData: ServerUserData;
  projectId: number;
  chatCredentials: AuthParams;
};

// Types for action inside a reducer
export type ActivityAction = ReturnType<
  | typeof actionsActivity.successClearHistoryAction
  | typeof actionsActivity.successGetAction
  | typeof actionsActivity.successAction
>;

export type InviteAction = ReturnType<
  | typeof actionsTasks.successFetchTask
  | typeof actionsTasks.successAddTask
  | typeof actionsTasks.successEditTask
  | typeof actionsTasks.successDeleteTask
  | typeof actionsColumns.successFetchColumn
  | typeof actionsColumns.successAddColumn
  | typeof actionsColumns.successEditColumn
  | typeof actionsColumns.successDeleteColumn
>;

export type ChatAction = ReturnType<
  typeof successLoginChatUser | typeof successLogoutChatUser
>;

export type memberAction = ReturnType<
  | typeof actionsSearch.successSearchAction
  | typeof actionsInvite.successFetchMembers
  | typeof actionsInvite.successEditMembers
  | typeof actionsInvite.successAddMember
  | typeof actionsInvite.successRemoveMember
  | typeof actionsSearch.clearSearch
  | typeof sidePanelError
  | typeof actionsSearch.searchLoader
>;
