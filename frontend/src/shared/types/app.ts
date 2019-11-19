import { IRootState as ProjectReduxState } from '$redux/project/reducer';
import { IRootState as UserReduxState } from '$redux/user/reducer';
import { RouterState } from 'connected-react-router';

export type AppReduxState = {
  project: ProjectReduxState;
  user: UserReduxState;
  router: RouterState;
}
