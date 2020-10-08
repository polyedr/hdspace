import { history } from '../redux/store';
import { PATH_NAMES } from '../constants/pathNames';

export const openProjects = () => history.push(PATH_NAMES.projects);
export const openSignScreen = (pathname: keyof typeof PATH_NAMES.user) =>
  history.push(PATH_NAMES.user[pathname]);

export const openProject = (projectId: string) => {
  history.push(`/project/${projectId}`);
};
