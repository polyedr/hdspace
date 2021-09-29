import { ServerUserData } from '../types';

export interface TaskData {
  id: number;
  title: string;
  description: string;
  owner: number;
  category: string;
  column?: number;
  isCompleted: boolean;
  user?: ServerUserData;
}

export interface ColumnData {
  id: number;
  title: string;
  description: string;
  project: number;
  tasks: Array<TaskData>;
  created?: string;
  modified?: string;
}

export type Permission = string;

export type PermissionsData = {
  permissions: Array<Permission>;
  userdata: ServerUserData;
};

export interface MemberData {
  id: number;
  project: number;
  role: string;
  status: string;
  user: ServerUserData;
  user_id: number;
  username?: string;
  permissions: Array<Permission>;
}
