import { IColumn, ITask } from '@Src/pm-types/board/types';
import { AuthParams } from '@Src/pm-types/chat/types';
import { IMember, PermissionsType } from '@Src/pm-types/invite/types';
import { IUser } from '@Src/pm-types/user/types';
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

export type BoardState = {
  columnList: IColumn[];
  taskList: ITask[];
  boardError: string | null;
  loaderBoard: boolean;
};

export type InviteState = {
  members: Array<IMember>;
  permissions: Array<PermissionsType>;
  searchResult: any;
  loaderSearch: boolean;
  loaderMembers: boolean;
  msg: string;
};

export type UserState = {
  userData: IUser;
  projectId: number;
  chatCredentials: AuthParams;
};
