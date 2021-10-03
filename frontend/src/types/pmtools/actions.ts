import { ServerUserData } from '../types';
import { ToServerTask } from './generators';
import { Permission } from './types';

export type ToServerPermissions = {
  access: string;
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
  access: string;
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
  access?: string;
  action?: string;
  username?: string;
  permissions?: Array<Permission>;
};

export type RequestAction = {
  project: number;
  action: string;
  access: string;
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
  access: string;
};

export type AccessType = string;

export type ToServerSearchMember = {
  access: string;
  search: string;
};

export interface RequestFetchColumns {
  access: string;
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
  access: string;
}

export interface RequestPermissions {
  access: string;
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
  access: string;
}
