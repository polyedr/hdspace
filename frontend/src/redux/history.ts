import { createBrowserHistory } from 'history';
import { createReduxHistoryContext } from 'redux-first-history';
import PATH_NAMES from '@Constants/pathNames';

const browserHistory = createBrowserHistory();

export const {
  createReduxHistory,
  routerMiddleware,
  routerReducer,
} = createReduxHistoryContext({
  history: browserHistory,
});

export const openProjects = () => browserHistory.push(PATH_NAMES.projects);
export const openSignScreen = (pathname: keyof typeof PATH_NAMES.user) =>
  browserHistory.push(PATH_NAMES.user[pathname]);

export const openProject = (projectId: string) => {
  browserHistory.push(`/project/${projectId}`);
};

export default browserHistory;
