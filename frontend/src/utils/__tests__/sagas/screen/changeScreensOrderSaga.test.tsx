import sagaHelper from 'redux-saga-testing';
import { put, call, all, select } from 'redux-saga/effects';
import { changeScreensOrder } from '@Redux/project/sagas/screen';
import { apiUpdateScreen } from '@Api/screen';
import * as Actions from '@Redux/project/actions';
import { reqWrapper } from '@Redux/project/sagas/shared';
import { enqueueSnackbar } from '@Redux/notification/actions';
import {
  selectMasterScreen,
  selectScreensWithoutMaster,
} from '@Redux/project/selectors/screen';
import {
  beforeSagaTest,
  createMasterScreenMock,
  createScreenMock,
  projectScreensMock,
} from '../../test-utils';

describe('changeScreensOrderSaga', () => {
  beforeAll(beforeSagaTest);
  const oldIndex = 0;
  const newIndex = 1;
  const action = Actions.changeScreensOrder({ oldIndex, newIndex });
  const screen1 = createScreenMock(1, 1);
  const screen2 = createScreenMock(1, 2);
  const screenList = [screen1, screen2];
  const newScreenList = [
    { ...screen2, buoyancy: 1 },
    { ...screen1, buoyancy: 2 },
  ];
  const masterScreen = createMasterScreenMock(1);

  describe('under normal behavior', () => {
    const it = sagaHelper(changeScreensOrder(action));
    it('should select screens without master', (result) => {
      expect(result).toEqual(select(selectScreensWithoutMaster));
      return screenList;
    });

    it('should select master screen', (result) => {
      expect(result).toEqual(select(selectMasterScreen));
      return masterScreen;
    });

    it('should put setScreens action', (result) => {
      expect(result).toEqual(
        put(Actions.setScreens([masterScreen, ...newScreenList])),
      );
    });

    it('should call screen update request for each screen', (result) => {
      expect(result).toEqual(
        all(
          newScreenList.map(({ id, buoyancy }) =>
            call(reqWrapper, apiUpdateScreen, {
              id,
              data: {
                buoyancy,
              },
            }),
          ),
        ),
      );
      return projectScreensMock;
    });
  });

  describe('when api request fails', () => {
    const it = sagaHelper(changeScreensOrder(action));
    it('should select screens without master', (result) => {
      expect(result).toEqual(select(selectScreensWithoutMaster));
      return screenList;
    });

    it('should select master screen', (result) => {
      expect(result).toEqual(select(selectMasterScreen));
      return masterScreen;
    });

    it('should put setScreens action', (result) => {
      expect(result).toEqual(
        put(Actions.setScreens([masterScreen, ...newScreenList])),
      );
    });

    it('should call apiUpdateScreen request', (result) => {
      expect(result).toEqual(
        all(
          newScreenList.map(({ id, buoyancy }) =>
            call(reqWrapper, apiUpdateScreen, {
              id,
              data: {
                buoyancy,
              },
            }),
          ),
        ),
      );
      return newScreenList.map(() => ({
        error: 'test error',
      }));
    });

    it('should display an error message when change screen order', (result) => {
      expect(result).toEqual(
        all(
          newScreenList.map(() =>
            put(
              enqueueSnackbar(
                {
                  message: 'test error' || 'Failed to reorder screens',
                  options: {
                    variant: 'error',
                  },
                },
                new Error('test error'),
              ),
            ),
          ),
        ),
      );
    });
  });
});
