import sagaHelper from 'redux-saga-testing';
import { put, call, all } from 'redux-saga/effects';
import MockDate from 'mockdate';

import { changeScreensOrder } from '@Redux/project/sagas/screen';
import { apiUpdateScreen } from '@Api/screen';
import * as Actions from '@Redux/project/actions';
import { reqWrapper } from '@Redux/project/sagas/shared';
import { enqueueSnackbar } from '@Redux/notification/actions';
import { projectScreensMock } from '../test-utils';

describe('changeScreensOrderSaga Test', () => {
  beforeAll(() => {
    // eslint-disable-next-line no-console
    console.error = jest.fn();
    // stub current date and random value generator to pass enqueueSnackbar equality
    MockDate.set('2000-11-22');
    jest.spyOn(global.Math, 'random').mockReturnValue(0.123456789);
  });
  const action = Actions.changeScreensOrder(projectScreensMock);
  describe('WHEN method is called and API is in its working state', () => {
    // @ts-ignore
    const it = sagaHelper(changeScreensOrder(action));
    it('test 1', (result) => {
      expect(result).toEqual(put(Actions.setScreens(projectScreensMock)));
    });
    it('test 2', (result) => {
      expect(result).toEqual(
        all(
          projectScreensMock.map(({ id, buoyancy }) => {
            return call(reqWrapper, apiUpdateScreen, {
              id,
              data: {
                buoyancy,
              },
            });
          }),
        ),
      );
      return projectScreensMock;
    });
  });

  describe('WHEN method is called and API is in its working state', () => {
    // @ts-ignore
    const it = sagaHelper(changeScreensOrder(action));
    it('error test 1', (result) => {
      expect(result).toEqual(put(Actions.setScreens(projectScreensMock)));
    });
    it('error test 2', (result) => {
      expect(result).toEqual(
        all(
          projectScreensMock.map(({ id, buoyancy }) => {
            return call(reqWrapper, apiUpdateScreen, {
              id,
              data: {
                buoyancy,
              },
            });
          }),
        ),
      );
      return new Error('test error');
    });
  });
  it('displaying an error message when change screen order', (result) => {
    expect(result).toEqual(
      put(
        enqueueSnackbar(
          {
            message: 'Error: test error' || 'Failed to reorder screens',
            options: {
              variant: 'error',
            },
          },
          new Error('test error'),
        ),
      ),
    );
  });
});
