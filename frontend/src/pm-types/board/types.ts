import { IUser } from '../user/types';

export interface ITask {
  id: number;
  title: string;
  description: string;
  owner: number;
  category: string;
  column?: number;
  isCompleted: boolean;
  user?: IUser;
}

export interface IColumn {
  id: number;
  title: string;
  description: string;
  project: number;
  tasks: Array<ITask>;
  created?: string;
  modified?: string;
}

// API
export interface IToServerColumn {
  title: string;
  description: string;
  project: number;
}

export interface IFromServerColumn extends IToServerColumn {
  id: number;
}

export interface IToServerTask {
  title: string;
  description: string;
  status: string;
  column: number;
  creator: string;
  owner: number;
}

export interface IFromServerTask extends IToServerTask {
  id: number;
}
