export interface ServerProject {
  id: number,
  name: string,
  status: string,
  projectscreen: number[],
  created: string,
  updated: string,
}

export interface Project {
  id: number,
  name: string,
  status: string,
  projectscreen: number[],
  projectLoader: boolean,
  created: Date,
  updated: Date,
}