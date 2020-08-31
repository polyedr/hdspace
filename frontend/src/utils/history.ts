import { history } from '$redux/store';
import * as PATH_NAMES from '$constants/pathNames';

export const openProjects = () => history.push(PATH_NAMES.projects);
export const openSignScreen = (pathname: keyof typeof PATH_NAMES.user) =>
  history.push(PATH_NAMES.user[pathname]);

export const openProject = (projectId: string) => {
  history.push(`/project/${projectId}`);
};

export const openScreen = (projectId: string, screenId: string) =>
  history.push(`/project/${projectId}/screen/${screenId}`);
