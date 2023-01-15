import { select, call, put } from 'redux-saga/effects';
import { Action } from '@Redux/types';
import { UserProjectPermission } from '@Src/types';
import { enqueueSnackbar } from '@Redux/notification/actions';
import { selectCurrentUserProjectPermissions } from '../selectors';

const withRequiredPermissions =
  (...permissions: UserProjectPermission[]) =>
  (fn: any) =>
    function* (action?: Action) {
      const userPermissions = yield select(selectCurrentUserProjectPermissions);
      const allowToExecute = permissions.reduce(
        (predefinedPerms, perm) =>
          predefinedPerms && userPermissions.includes(perm),
        true,
      );
      if (!allowToExecute) {
        yield put(
          enqueueSnackbar({
            message: 'You do not have permissions to perform current action',
            options: { variant: 'warning' },
          }),
        );
        return;
      }
      const result = yield call(fn, action);
      // eslint-disable-next-line consistent-return
      return result;
    };

export default withRequiredPermissions;
