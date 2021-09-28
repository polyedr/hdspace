import { ColumnData, MemberData, TaskData } from '@Src/types/pmtools/types';
import { PermissionsType, ServerUserData } from '@Src/types/types';
import { DefaultRootState } from 'react-redux';

export type RootState = ReturnType<any>;

export interface InviteRootState extends DefaultRootState {
  invite: InviteState;
}

export interface BoardRootState extends DefaultRootState {
  board: BoardState;
}

export interface ActivityRootState extends DefaultRootState {
  activity: { actions: [] | Array<string> };
}

interface AuthLoginBase {
  realm?: string;
  username?: string;
}

export interface AuthParams extends AuthLoginBase {
  apiKey?: string;
}

export type BoardState = {
  columnList: ColumnData[];
  taskList: TaskData[];
  boardError: string | null;
  loaderBoard: boolean;
};

export type InviteState = {
  members: Array<MemberData>;
  permissions: Array<PermissionsType>;
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
