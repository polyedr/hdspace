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

export interface RequestDeleteTask {
  taskId: number;
  project: number;
  action: string;
  access: string;
}
