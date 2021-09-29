export type ToServerFetchMembers = {
  projectId: number;
  access: string;
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
  permissions?: { prevState: Array<string>; write: boolean };
};

export type ToServerPermissions = {
  access: string;
  permissions: Array<string>;
  projectid: number;
  username: string;
};

export type ToServerRemoveMember = {
  id: number; // member id
  access: string;
  project: number;
  action: string;
};

export interface ToServerColumn {
  title: string;
  description: string;
  project: number;
}

export interface FromServerColumn extends ToServerColumn {
  id: number;
}

export interface ToServerTask {
  title: string;
  description: string;
  status: string;
  column: number;
  creator: string;
  owner: number;
}

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
