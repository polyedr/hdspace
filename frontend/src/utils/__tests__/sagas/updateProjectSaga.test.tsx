import sagaHelper from 'redux-saga-testing';
import { select } from 'redux-saga/effects';
import { updateProjectSaga } from '@Redux/project/sagas/project';
import * as Actions from '@Redux/project/actions';
import { selectCurrentProject } from '@Redux/project/selectors/base';
import { beforeSagaTest, mockProject } from '../test-utils';

describe('updateProjectSaga Test', () => {
  beforeAll(beforeSagaTest);
  const action = Actions.updateProject(mockProject);
  describe('WHEN method is called and API is in its working state', () => {
    // @ts-ignore
    const it = sagaHelper(updateProjectSaga(action));
    it('test 1', (result) => {
      expect(result).toEqual(select(selectCurrentProject));
    });
  });
});
