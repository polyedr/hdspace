import { IColumn, ITask } from '@Src/types/board/types';
import { AuthParams } from '@Src/types/chat/types';
import { IMember, PermissionsType } from '@Src/types/invite/types';
import { IUser } from '@Src/types/user/types';
import { DefaultRootState } from 'react-redux';

export type RootState = ReturnType<any>;

export interface InviteRootState extends DefaultRootState {
  inviteReducer: InviteState;
}

export interface BoardRootState extends DefaultRootState {
  boardReducer: BoardState;
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
