import { ServerUserData } from '@Src/types';
import { DefaultRootState } from 'react-redux';
import {
  ActionTypePM,
  AuthParams,
  ChatClient,
  IMessageZulip,
} from '@Src/types/pmtools/types';
import { IBoard, IColumnData, IServerTaskData } from '@Src/types/pmtools/board';
import * as actionsActivity from './activity/actions';
import * as actionsColumns from './board/actions/columns';
import * as actionsTasks from './board/actions/tasks';
import {
  successLoginChatUser,
  successLogoutChatUser,
  successProjectStreamMessages,
  successSendStreamMessage,
} from './chat/actions';
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
  client: ChatClient | null;
  messages: Array<IMessageZulip> | [];
};

export interface BoardNewTask {
  title: string;
  columnId: number;
}

export interface BoardNewColumn {
  title: string;
  colour: string;
  projectId?: number;
}

export interface BoardTask {
  id: number;
  name: string;
  column: number;
  created: string;
  modified: string;
  due_date: string;
}
export interface BoardColumn {
  id: number;
  title: string;
  tasks: BoardTask[];
}

export type BoardState = {
  fetching: boolean;
  columns: BoardColumn[];
  members: Array<any>;
};

export type InviteState = {
  members: Array<any>;
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

export type BoardAction = ReturnType<
  | typeof actionsTasks.successFetchTask
  | typeof actionsTasks.successAddTask
  | typeof actionsTasks.successEditTask
  | typeof actionsTasks.successDeleteTask
  | typeof actionsTasks.successUpdateCardIndex
  | typeof actionsTasks.successFetchMembers
>;

export type ChatAction = ReturnType<
  | typeof successLoginChatUser
  | typeof successLogoutChatUser
  | typeof successProjectStreamMessages
  | typeof successSendStreamMessage
>;

export type memberAction = ReturnType<
  typeof sidePanelError | typeof successSendEmail
>;
