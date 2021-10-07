import { ServerUserData } from '../types';
import { ToServerTask } from './generators';
import { Permission } from './types';

export type ToServerPermissions = {
  permissions: Array<string>;
  projectid: number;
  username: string;
};

export interface FromServerTask extends ToServerTask {
  id: number;
}

interface AuthLoginBase {
  realm?: string;
  username?: string;
}

export interface AuthParams extends AuthLoginBase {
  apiKey?: string;
}

export type ToServerRemoveMember = {
  id: number; // member id
  project: number;
  action: string;
  permissions: Array<Permission>;
  username: string;
};

export type ToServerMember = {
  id?: number;
  project: number; // projectId
  role: string;
  status: string;
  user_id: number;
  action?: string;
  username?: string;
  permissions?: Array<Permission>;
};

export type RequestAction = {
  project: number;
  action: string;
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

export interface RequestFetchColumns {
  project: number;
}

export interface RequestDeleteColumn extends RequestFetchColumns {
  columnId: number;
  action: string;
}

export interface RequestColumn extends RequestFetchColumns {
  id?: number;
  action: string;
  description: string;
  title: string;
}

export interface RequestTask {
  id?: number;
  title: string;
  description: string;
  owner: number;
  column?: number;
  project: number;
  creator: string;
  status: string;
  action: string;
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

export interface RequestDeleteTask {
  taskId: number;
  project: number;
  action: string;
}
