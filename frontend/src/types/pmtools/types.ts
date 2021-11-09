import { ServerUserData } from '../types';

export type ChatClient = any;

export type PlatformActionData = 'PM-TOOLS' | 'MAIN-APP' | 'ALL';

export interface ActionTypePM {
  priority: 'high' | 'medium' | 'low';
  platform: PlatformActionData;
  action: string;
}

export type PmToolsUserChat = {
  realm?: string;
  username?: string;
  password: string;
};

export type MoveCardToListType = {
  cardId: number;
  destination: string;
  newPos: number;
};

export interface TaskData {
  id: string;
  name: string;
  description: string;
  owner: number;
  category: string;
  column?: number;
  isCompleted: boolean;
  user?: ServerUserData;
}

export interface ColumnData {
  id: string | number;
  name: string;
  description: string;
  project: number;
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

export interface ChatLoginData {
  realm: string;
  username: string;
  password: string;
}
