import { IRootState as ProjectReduxState } from '$redux/project/reducer';
import { IRootState as UserReduxState } from '$redux/user/reducer';

export type AppReduxState = {
  project: ProjectReduxState;
  user: UserReduxState;
}
