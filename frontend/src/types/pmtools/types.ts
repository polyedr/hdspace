import { Permission, ServerUserData, UserData } from '@Src/types/types';

// Members
export interface MemberData {
  id: number;
  project: number;
  role: string;
  status: string;
  user: UserData;
  user_id: number;
  username?: string;
  permissions: Array<Permission>;
}

// Board
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
