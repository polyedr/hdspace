import { RouterState } from 'connected-react-router';
import { ProjectState } from '../../redux/project/types';
import { UserState } from '../../redux/user/types';

export type AppReduxState = {
  user: UserState;
  project: ProjectState;
  router: RouterState;
};
