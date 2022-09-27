/* eslint-disable import/no-cycle */
import { ServerUserData } from '@Src/types';
import { DefaultRootState } from 'react-redux';
import {
  ActionTypePM,
  AuthParams,
  ChatClient,
  IMessageZulip,
} from '@Src/types/pmtools/types';
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

interface BoardTaskUser {
  date_joined: string;
  email: string;
  first_name: string;
  id: number;
  is_active: boolean;
  last_name: string;
  profile_avatar?: string;
  username: string;
}

export enum PriorityOptions {
  Highest = 'highest',
  High = 'high',
  Medium = 'medium',
  Low = 'low',
  Lowest = 'lowest',
}

export enum StatusOptions {
  Pending = 'pending',
  Progress = 'in progress',
  Paused = 'paused',
  Accepted = 'accepted',
  Review = 'waiting for review',
}

export interface BoardTaskComment {
  id: number;
  text: string;
  user: BoardTaskUser;
  created: string;
}

export interface BoardLabel {
  id: number;
  text: string;
  colour: string;
}

export interface BoardTaskCheckListItem {
  id: number;
  text: string;
  status: number;
}

export interface BoardTask {
  id: number;
  title: string;
  description?: string;
  column: number;
  created: string;
  modified: string;
  due_date: string;
  author: BoardTaskUser;
  assignee: BoardTaskUser;
  assignee_id?: number;
  responsible: BoardTaskUser;
  responsible_id?: number;
  label_ids: number[];
  priority: PriorityOptions;
  story_points: number;
  time?: string;
  status: StatusOptions;
  comments?: BoardTaskComment[];
  checklist: BoardTaskCheckListItem[];
}

export interface BoardColumn {
  id: number;
  title: string;
  colour: string;
  tasks: BoardTask[];
}

export interface BoardNewColumn {
  title: string;
  colour: string;
  projectId?: number;
}

export type BoardState = {
  fetching: boolean;
  columns: BoardColumn[];
  members: Array<any>;
  labels: BoardLabel[];
  activeTask: BoardTask | null;
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
  | typeof actionsColumns.setColumnsFetching
  | typeof actionsColumns.fetchBoard
  | typeof actionsColumns.updateColumnsOrder
  | typeof actionsColumns.updateTasksOrder
  | typeof actionsColumns.setColumns
  | typeof actionsColumns.createColumn
  | typeof actionsColumns.updateColumn
  | typeof actionsColumns.updateColumnOnState
  | typeof actionsColumns.addColumn
  | typeof actionsColumns.deleteColumn
  | typeof actionsColumns.deleteColumnFromState
  | typeof actionsTasks.addTask
  | typeof actionsTasks.setTasks
  | typeof actionsTasks.createTask
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
