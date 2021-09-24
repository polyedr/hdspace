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
  access?: string;
};
