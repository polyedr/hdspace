import { path } from 'ramda';
import { call, put, select, take } from 'redux-saga/effects';
import { convertProjectToPatchRequest } from '@Api/converters/toRequest';
import { apiUpdateProject } from '@Api/project';
import { apiRefreshToken } from '@Api/user';
import getSavedValue from '@Utils/getSavedValue';
import { MAX_TOKEN_TRIALS } from '@Src/config/settings';
import {
  LibraryElementUnion,
  Project,
  Result,
  SavedElementsValues,
} from '@Src/types';
import TYPES from '../../actionTypes';
import { openSignScreen } from '../../history';
import { enqueueSnackbar } from '../../notification/actions';
import {
  logout,
  setLoadedToken,
  setTokenPair,
  setUserError,
} from '../../user/actions';
import { selectIsTokenLoaded, selectTokenPair } from '../../user/selectors';
import * as Actions from '../actions';
import { selectSavedElementsValues } from '../selectors/element';

// eslint-disable-next-line consistent-return
export function* refreshTokensSaga() {
  try {
    const { refresh } = yield select(selectTokenPair);

    const accessResult = refresh && (yield call(apiRefreshToken, refresh));

    if (accessResult?.access) {
      return { refresh, access: accessResult.access };
    }

    return accessResult;
  } catch (e) {
    if (e instanceof Error) {
      yield put(setUserError(e));
    }
  }
}

// eslint-disable-next-line consistent-return
export function* reqWrapper(
  requestAction: (props: any) => Promise<any>,
  props: any = {},
  tries = 0,
) {
  try {
    const { access } = yield select(selectTokenPair);
    const result = yield call(requestAction as any, { access, ...props });

    if (
      path(['response', 'data', 'code'], result) === 'token_not_valid' ||
      result?.error === 'Given token not valid for any token type'
    ) {
      const isTokenLoaded: boolean = yield select(selectIsTokenLoaded);

      if (isTokenLoaded) {
        yield put(setLoadedToken(false));
      } else {
        yield take(TYPES.SET_LOADED_TOKEN);

        return yield call(reqWrapper, requestAction, props, tries + 1);
      }

      const tokenResult = yield call(refreshTokensSaga);

      if (!tokenResult || tokenResult.msg || tries >= MAX_TOKEN_TRIALS - 1) {
        yield put(logout());
        yield call(openSignScreen, 'signin');

        return { error: 'Logged out' };
      }

      yield put(setTokenPair(tokenResult));
      yield put(setLoadedToken(true));

      return yield call(reqWrapper, requestAction, props, tries + 1);
    }

    if (path(['response', 'statusText'], result) === 'Unauthorized') {
      yield put(logout());
      openSignScreen('signin');

      return { error: 'Logged out' };
    }

    if (path(['response', 'status'], result)) {
      return null;
    }

    return result;
  } catch (e) {
    if (e instanceof Error) {
      yield put(setUserError(e));
      return { error: e.message };
    }
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
    if (e instanceof Error) {
      yield put(
        enqueueSnackbar(
          {
            message: e.message,
            options: {
              variant: 'error',
            },
          },
          e,
        ),
      );
    }
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

      // if (element.type === 'radiobutton') {
      //   return {
      //     ...acc,
      //     [element.parameters.name || '']: { savedValue: '' },
      //   };
      // }

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
