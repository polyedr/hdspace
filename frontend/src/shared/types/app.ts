import { RouterState } from 'connected-react-router';
import { ProjectState as ProjectReduxState } from '../../redux/project/types';
import { UserState as UserReduxState } from '../../redux/user/types';

export type AppReduxState = {
  project: ProjectReduxState;
  user: UserReduxState;
  router: RouterState;
};
