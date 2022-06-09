import { put, call, select } from 'redux-saga/effects';
import { apiGetProjectWithScreensForTemplates } from '@Api/marketplace';
import {
  Result,
  PaginatedResponse,
  Marketplace,
  TemplatesSearchParameter,
  DateRange,
} from '@Src/types';
import {
  selectTemplatesSearchParameter,
  selectTemplatessDataNext,
} from '@Redux/marketplace/selectors/base';
import getTemplatesSearchParams from '@Utils/getTemplatesSearchParams';
import { enqueueSnackbar } from '../../notification/actions';
import { reqWrapper } from '../../project/sagas/shared';
import * as Actions from '../actions';

export function* searchTemplatesSaga() {
  try {
    yield put(Actions.setMarketplaceListLoader(true));
    yield put(
      Actions.setMarketplaceScreensData({
        next: null,
        previous: null,
        results: [],
      }),
    );
    yield put(Actions.setTemplatesList([]));

    let paramData: [
      TemplatesSearchParameter | 'tags__name',
      string | DateRange,
    ] = yield select(selectTemplatesSearchParameter);

    if (paramData[0] === 'tags') {
      paramData = ['tags__name', paramData[1]];
    }

    const { result, error }: Result = yield call(
      reqWrapper,
      apiGetProjectWithScreensForTemplates,
      {
        params: getTemplatesSearchParams(paramData),
      },
    );

    if (result) {
      yield put(Actions.setMarketplaceScreensData(result));
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
  } finally {
    yield put(Actions.setMarketplaceListLoader(false));
  }
}

export function* GetScreenFormMarketplaceSaga() {
  try {
    yield put(Actions.setMarketplaceListLoader(true));
    const next: string | null = yield select(selectTemplatessDataNext);
    const paramData: [TemplatesSearchParameter, string] = yield select(
      selectTemplatesSearchParameter,
    );
    const searchParams = getTemplatesSearchParams(paramData);
    const {
      result,
      error,
    }: Result<PaginatedResponse<Marketplace>> = yield call(
      reqWrapper,
      apiGetProjectWithScreensForTemplates,
      {
        params: {
          cursor: next,
          ...(paramData[1] && {
            ...searchParams,
          }),
        },
      },
    );

    if (result) {
      yield put(Actions.setMarketplaceScreensData(result));
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
  } finally {
    yield put(Actions.setMarketplaceListLoader(false));
  }
}
