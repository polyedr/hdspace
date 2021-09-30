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
  permissions: { write: boolean; prevState: Array<Permissions> };
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
