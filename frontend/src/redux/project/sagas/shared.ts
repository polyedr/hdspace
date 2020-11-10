import { call, put, select, take } from 'redux-saga/effects';
import * as R from 'ramda';
import { selectTokenPair } from '../../user/selectors';
import { LibraryElementUnion, Project } from '../../../types';
import {
  logout,
  setAuthError,
  setLoadedToken,
  setTokenPair,
} from '../../user/actions';
import { MAX_TOKEN_TRIALS } from '../../../../config/settings';
import { DEFAULT_AUTHORIZATION_TOKEN } from '../../../constants/defaultParams';
import * as Actions from '../actions';
import { convertProjectToPatchRequest } from '../../../api/converters/toRequest';
import { apiSaveProject } from '../../../api/project';
import { selectors } from '../index';
import getSavedValue from '../../../utils/getSavedValue';
import { openSignScreen } from '../../history';
import { apiRefreshToken } from '../../../api/user';
import { AppReduxState } from '../../types';

// eslint-disable-next-line consistent-return
export function* refreshUserTokenPair() {
  try {
    const { refresh } = yield select(selectTokenPair);

    const accessResult = refresh && (yield call(apiRefreshToken, refresh));

    if (accessResult && accessResult.access) {
      return { refresh, access: accessResult.access };
    }

    return accessResult;
  } catch (e) {
    yield put(setAuthError(e));
  }
}

export function* reqWrapper(
  requestAction: (props: any) => Promise<any>,
  props: any = {},
  tries = 0,
): any {
  const { access } = yield select(selectTokenPair);
  const result = yield call(requestAction as any, { access, ...props });

  if (R.path(['response', 'data', 'code'], result) === 'token_not_valid') {
    const {
      user: { isLoadedToken },
    }: AppReduxState = yield select();

    if (isLoadedToken) {
      yield put(setLoadedToken(false));
    } else {
      yield take('SET_LOADED_TOKEN');

      return yield call(reqWrapper, requestAction, props, tries + 1);
    }

    const tokenResult = yield call(refreshUserTokenPair);

    if (!tokenResult || tokenResult.msg || tries >= MAX_TOKEN_TRIALS - 1) {
      yield put(setTokenPair(DEFAULT_AUTHORIZATION_TOKEN));
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
}

export function* updateProject(newProject: Project) {
  yield put(Actions.setProject(newProject));
  const convertedProject = convertProjectToPatchRequest(newProject);
  yield call(reqWrapper, apiSaveProject, { data: convertedProject });
}

export function* updateSavedElementsValues(elements: LibraryElementUnion[]) {
  const oldSavedElementsValues: ReturnType<typeof selectors.selectSavedElementsValues> = yield select(
    selectors.selectSavedElementsValues,
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
