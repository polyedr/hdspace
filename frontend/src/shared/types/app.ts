import { ReduxState as ProjectReduxState } from '$redux/project/types';
import { IRootState as UserReduxState } from '$redux/user/reducer';
import { RouterState } from 'connected-react-router';

export type AppReduxState = {
  project: ProjectReduxState;
  user: UserReduxState;
  router: RouterState;
}
