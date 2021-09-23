export type ToServerFetchMemberList = {
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
};

export type ToServerRemoveMember = {
  id: number; // member id
  access?: string;
};
