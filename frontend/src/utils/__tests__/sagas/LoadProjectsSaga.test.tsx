import sagaHelper from 'redux-saga-testing';
import { put, select, call } from 'redux-saga/effects';
import MockDate from 'mockdate';

import { getProjectListSaga } from '@Redux/project/sagas/project';
import * as Actions from '@Redux/project/actions';
import {
  selectProjectsDataNext,
  selectProjectsSearchParameter,
} from '@Redux/project/selectors/base';
import { reqWrapper } from '@Redux/project/sagas/shared';
import { apiGetProjectList } from '@Api/project';
import { DEFAULT_PROJECT } from '@Constants/defaultParams';
import { enqueueSnackbar } from '@Redux/notification/actions';

describe('getProjectListSaga Test', () => {
  describe('WHEN method is called and API is in its working state', () => {
    // @ts-ignore
    const it = sagaHelper(getProjectListSaga());

    it('should set projects list loader flag to true', (result) => {
      expect(result).toEqual(put(Actions.setProjectListLoader(true)));
    });

    it('should get next page link from initial state', (result) => {
      expect(result).toEqual(select(selectProjectsDataNext));
      return 'next page link';
    });

    it('should get search parameters', (result) => {
      expect(result).toEqual(select(selectProjectsSearchParameter));
      return ['status', 'pending'];
    });

    it('should request API to get list of projects', (result) => {
      expect(result).toEqual(
        call(reqWrapper, apiGetProjectList, {
          params: {
            cursor: 'next page link',
            status: 'pending',
          },
        }),
      );
      return {
        result: {
          next: null,
          previous: 'next page link',
          results: [DEFAULT_PROJECT],
        },
      };
    });

    it('should set projects data to the initial state', (result) => {
      expect(result).toEqual(
        put(
          Actions.setProjectsData({
            next: null,
            previous: 'next page link',
            results: [DEFAULT_PROJECT],
          }),
        ),
      );
    });
  });

  describe('WHEN method is called and API returns an error', () => {
    beforeAll(() => {
      // eslint-disable-next-line no-console
      console.error = jest.fn();
      // stub current date and random value generator to pass enqueueSnackbar equality
      MockDate.set('2000-11-22');
      jest.spyOn(global.Math, 'random').mockReturnValue(0.123456789);
    });

    // reset all stubs
    afterAll(() => {
      jest.restoreAllMocks();
    });
    // @ts-ignore
    const it = sagaHelper(getProjectListSaga());

    it('should set projects list loader flag to true', (result) => {
      expect(result).toEqual(put(Actions.setProjectListLoader(true)));
    });

    it('should get next page link from initial state', (result) => {
      expect(result).toEqual(select(selectProjectsDataNext));
      return 'next page link';
    });

    it('should get search parameters', (result) => {
      expect(result).toEqual(select(selectProjectsSearchParameter));
      return ['status', 'pending'];
    });

    it('should request API to get list of projects', (result) => {
      expect(result).toEqual(
        call(reqWrapper, apiGetProjectList, {
          params: {
            cursor: 'next page link',
            status: 'pending',
          },
        }),
      );
      return {
        error: new Error('some API error'),
      };
    });

    it('should display an error to user via snackbar', (result) => {
      expect(result).toEqual(
        put(
          enqueueSnackbar({
            message: 'Error: some API error',
            options: { variant: 'error' },
          }),
        ),
      );
    });
  });
});
