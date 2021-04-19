import sagaHelper from 'redux-saga-testing';
import { select } from 'redux-saga/effects';
import MockDate from 'mockdate';

import { updateProjectSaga } from '@Redux/project/sagas/project';
import * as Actions from '@Redux/project/actions';
import { selectCurrentProject } from '@Redux/project/selectors/base';
import { mockProject } from '../test-utils';

describe('updateProjectSaga Test', () => {
  beforeAll(() => {
    console.error = jest.fn();
    // stub current date and random value generator to pass enqueueSnackbar equality
    MockDate.set('2000-11-22');
    jest.spyOn(global.Math, 'random').mockReturnValue(0.123456789);
  });
  const action = Actions.updateProject(mockProject);
  describe('WHEN method is called and API is in its working state', () => {
    // @ts-ignore
    const it = sagaHelper(updateProjectSaga(action));
    it('test 1', (result) => {
      expect(result).toEqual(select(selectCurrentProject));
    });
  });
});
