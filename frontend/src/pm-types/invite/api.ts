export type ToServerFetchMemberList = {
  projectId: number;
  access: string;
};

export type ToServerAddMember = {
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
