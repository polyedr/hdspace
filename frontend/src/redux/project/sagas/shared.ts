import { call, put, select, take } from 'redux-saga/effects';
import * as R from 'ramda';
import { selectIsTokenLoaded, selectTokenPair } from '../../user/selectors';
import {
  LibraryElementUnion,
  Project,
  Result,
  SavedElementsValues,
} from '../../../types';
import {
  logout,
  setUserError,
  setLoadedToken,
  setTokenPair,
} from '../../user/actions';
import { MAX_TOKEN_TRIALS } from '../../../config/settings';
import * as Actions from '../actions';
import { convertProjectToPatchRequest } from '../../../api/converters/toRequest';
import { apiUpdateProject } from '../../../api/project';
import getSavedValue from '../../../utils/getSavedValue';
import { openSignScreen } from '../../history';
import { apiRefreshToken } from '../../../api/user';
import TYPES from '../../actionTypes';
import { selectSavedElementsValues } from '../selectors';
import { enqueueSnackbar } from '../../notification/actions';

// eslint-disable-next-line consistent-return
export function* refreshUserTokenPairSaga() {
  try {
    const { refresh } = yield select(selectTokenPair);

    const accessResult = refresh && (yield call(apiRefreshToken, refresh));

    if (accessResult?.access) {
      return { refresh, access: accessResult.access };
    }

    return accessResult;
  } catch (e) {
    yield put(setUserError(e));
  }
}

export function* reqWrapper(
  requestAction: (props: any) => Promise<any>,
  props: any = {},
  tries = 0,
) {
  try {
    const { access } = yield select(selectTokenPair);
    const result = yield call(requestAction as any, { access, ...props });

    if (
      R.path(['response', 'data', 'code'], result) === 'token_not_valid' ||
      result.error === 'Given token not valid for any token type'
    ) {
      const isTokenLoaded: boolean = yield select(selectIsTokenLoaded);

      if (isTokenLoaded) {
        yield put(setLoadedToken(false));
      } else {
        yield take(TYPES.SET_LOADED_TOKEN);

        return yield call(reqWrapper, requestAction, props, tries + 1);
      }

      const tokenResult = yield call(refreshUserTokenPairSaga);

      if (!tokenResult || tokenResult.msg || tries >= MAX_TOKEN_TRIALS - 1) {
        yield put(logout());
        yield call(openSignScreen, 'signin');

        return null;
      }

      yield put(setTokenPair(tokenResult));
      yield put(setLoadedToken(true));

      return yield call(reqWrapper, requestAction, props, tries + 1);
    }

    if (R.path(['response', 'statusText'], result) === 'Unauthorized') {
      yield put(logout());
      openSignScreen('signin');

      return null;
    }

    if (R.path(['response', 'status'], result)) {
      return null;
    }

    return result;
  } catch (e) {
    yield put(setUserError(e));
    return null;
  }
}

// eslint-disable-next-line consistent-return
export function* projectUpdateHelperSaga(newProject: Project) {
  try {
    yield put(Actions.setProject(newProject));
    const { result, error }: Result<Project> = yield call(
      reqWrapper,
      apiUpdateProject,
      {
        data: convertProjectToPatchRequest(newProject),
      },
    );

    if (result) {
      return true;
    }

    if (error) {
      throw new Error(error);
    }
  } catch (e) {
    yield put(
      enqueueSnackbar({
        message: e.message,
        options: {
          variant: 'error',
        },
      }),
    );
  }
}

export function* updateSavedElementsValues(elements: LibraryElementUnion[]) {
  const oldSavedElementsValues: SavedElementsValues = yield select(
    selectSavedElementsValues,
  );

  const newSavedElementsValues = elements
    .filter((element) =>
      Object.keys(oldSavedElementsValues).every(
        (elementID) => elementID !== element.id,
      ),
    )
    .reduce((acc, element) => {
      const savedValue = getSavedValue(element);

      if (element.type === 'radiobutton') {
        return {
          ...acc,
          [element.parameters.name || '']: { savedValue: '' },
        };
      }

      return {
        ...acc,
        [element.id]: { id: element.id, savedValue },
      };
    }, {});

  yield put(
    Actions.updateSavedElementsValues({
      ...oldSavedElementsValues,
      ...newSavedElementsValues,
    }),
  );
}
