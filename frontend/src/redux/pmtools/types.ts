import { AuthParams, RequestAction } from '@Src/types/pmtools/api';
import {
  ChatLoginData,
  ColumnData,
  MemberData,
  PermissionsData,
  TaskData,
} from '@Src/types/pmtools/types';
import { ServerUserData } from '@Src/types/types';
import { DefaultRootState } from 'react-redux';
import {
  successAction,
  successClearHistoryAction,
  successGetAction,
} from './activity/actions';
import {
  loaderBoard,
  successAddColumn,
  successDeleteColumn,
  successEditColumn,
  successFetchColumn,
} from './board/actions/columns';
import {
  successAddTask,
  successDeleteTask,
  successEditTask,
  successFetchTask,
} from './board/actions/tasks';

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
  actions: Array<RequestAction['action']> | [];
};

export type ChatState = {
  client: ChatLoginData | null;
  isAuth: boolean;
};

export type BoardState = {
  columnList: ColumnData[];
  taskList: TaskData[];
  loaderBoard: boolean;
};

export type InviteState = {
  members: Array<MemberData>;
  permissions: Array<PermissionsData>;
  searchResult: any;
  loaderSearch: boolean;
  loaderMembers: boolean;
  msg: string;
};

export type UserState = {
  userData: ServerUserData;
  projectId: number;
  chatCredentials: AuthParams;
};

export type ActivityAction = ReturnType<
  | typeof successClearHistoryAction
  | typeof successGetAction
  | typeof successAction
>;

export type InviteAction = ReturnType<
  | typeof successFetchTask
  | typeof successAddTask
  | typeof successEditTask
  | typeof successDeleteTask
  | typeof loaderBoard
  | typeof successFetchColumn
  | typeof successAddColumn
  | typeof successEditColumn
  | typeof successDeleteColumn
>;
