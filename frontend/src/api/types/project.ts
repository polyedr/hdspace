import { CssLikeStyles } from '$utils/StyleHelper';
import { Entity } from '$domain/core';

export type CreatedServerProject = {
  name: string,
  status: string,
  projectscreen: number[],
  project_data_json: string,
};

export type ServerProject = {
  id: number,
  name: string,
  status: string,
  projectscreen: number[],
  created: string,
  updated: string,
  project_data_json: string,
  project_data_text: string,
};

export type ProjectClass = {
  className: string;
  supportedElement: Entity;
  rules: CssLikeStyles;
};

export type Project = {
  id: number,
  name: string,
  status: string,
  projectscreen: number[],
  projectLoader: boolean,
  created: Date,
  updated: Date,
  projectData: {
    classes: ProjectClass[],
  },
};
