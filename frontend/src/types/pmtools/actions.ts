import { DropResult } from 'react-beautiful-dnd';
import { ServerUserData } from '../types';
import { IServerTaskData } from './trelloTypes';
import { Permission } from './types';

export type ToServerPermissions = {
  permissions: Array<string>;
  projectid: number;
  username: string;
};

export interface AuthParams {
  apiKey?: string;
  realm?: string;
  username?: string;
}

export type RequestRemoveMember = {
  id: number; // member id
  project: number;
  action: string;
  permissions: Array<Permission>;
  username: string;
};

export type RequestMember = {
  id?: number;
  project: number; // projectId
  role: string;
  status: string;
  user_id: number;
  username?: string;
  permissions?: Array<Permission>;
};

export type RequestAction = {
  project: number;
  action: string;
  platform?: string;
  priority?: string;
};

export type FromServerMember = {
  id: number;
  project: number;
  role: string;
  status: string;
  user: ServerUserData;
  user_id: number;
};

export type ToServerFetchMembers = {
  projectId: number;
};

export type AccessType = string;

export type ToServerSearchMember = {
  search: string;
};

export type DestinationType = {
  index: number;
  droppableId: string;
};

export type UpdateCardIndexType = {
  destination: DestinationType;
  source: DropResult['source'];
};

export type UpdateCardIndexTypeSuccess = {
  dest: number;
  removed: IServerTaskData;
  destList: any;
  source: number;
  sourceList: any;
};

export interface RequestColumn {
  id?: string | number;
  project: number;
  name: string;
}

export interface RequestTask {
  id?: number;
  name?: string;
  description?: string;
  owner?: number | null;
  column?: number | string;
  project: number;
  creator?: string;
  status?: string;
}

export interface RequestPermissions {
  action: string;
  id: number;
  permissions: Array<Permissions> | [];
  role: number;
  username: string;
  user_id: string;
  project: number;
  status: string;
}
