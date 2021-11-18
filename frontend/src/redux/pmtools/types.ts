import {
  ActionTypePM,
  ChatLoginData,
  MemberData,
} from '@Src/types/pmtools/types';
import { ServerUserData } from '@Src/types/types';
import { DefaultRootState } from 'react-redux';
import { AuthParams } from '@Src/types/pmtools/actions';
import { IColumnData, IServerTaskData } from '@Src/types/pmtools/trelloTypes';
import * as actionsActivity from './activity/actions';
import * as actionsColumns from './board/actions/columns';
import * as actionsTasks from './board/actions/tasks';
import { successLoginChatUser, successLogoutChatUser } from './chat/actions';
import { successSendEmail, sidePanelError } from './invite/actions';

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
  boardName: string;
  columnList: Array<IColumnData>;
  taskList: Array<IServerTaskData>;
};

export type InviteState = {
  members: Array<MemberData>;
  searchResult: any;
  email: string;
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
  | typeof actionsTasks.successUpdateCardIndex
  | typeof actionsColumns.successFetchColumn
  | typeof actionsColumns.successAddColumn
  | typeof actionsColumns.successEditColumn
  | typeof actionsColumns.successDeleteColumn
  | typeof actionsColumns.successBoardId
>;

export type ChatAction = ReturnType<
  typeof successLoginChatUser | typeof successLogoutChatUser
>;

export type memberAction = ReturnType<
  typeof sidePanelError | typeof successSendEmail
>;
