import { AuthParams } from '@Src/types/pmtools/api';
import {
  ChatLoginData,
  ColumnData,
  MemberData,
  PermissionsData,
  TaskData,
} from '@Src/types/pmtools/types';
import { ServerUserData } from '@Src/types/types';
import { DefaultRootState } from 'react-redux';

export interface InviteRootState extends DefaultRootState {
  invite: InviteState;
}

export interface BoardRootState extends DefaultRootState {
  board: BoardState;
}

export interface ActivityRootState extends DefaultRootState {
  activity: { actions: [] | Array<string> };
}
export interface ChatRootState extends DefaultRootState {
  chat: ChatState;
}

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
