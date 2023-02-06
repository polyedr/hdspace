import sagaHelper from 'redux-saga-testing';
import { put, call } from 'redux-saga/effects';
import { getProjectSaga } from '@Redux/project/sagas/project';
import * as Actions from '@Redux/project/actions';
import { reqWrapper } from '@Redux/project/sagas/shared';
import { apiGetProjectWithScreens } from '@Api/project';
import { enqueueSnackbar } from '@Redux/notification/actions';
import {
  beforeSagaTest,
  createMockProject,
  createProjectWithScreensMock,
} from '../../test-utils';

describe('getProjectSaga Test', () => {
  beforeAll(beforeSagaTest);
  const action = Actions.getProject(10);
  const mockProject = createMockProject();
  const projectWithScreens = createProjectWithScreensMock(mockProject.id);
  describe('under normal behavior', () => {
    const it = sagaHelper(getProjectSaga(action));

    it('should set projects list loader flag to true', (result) => {
      expect(result).toEqual(put(Actions.setProjectLoader(true)));
    });
    it('should fetch project with screens', (result) => {
      expect(result).toEqual(
        call(reqWrapper, apiGetProjectWithScreens, {
          id: 10,
        }),
      );
      return {
        result: projectWithScreens,
      };
    });
  });

  describe('when project with screens request fails', () => {
    const errorMessage = 'Error message';
    const error = new Error(errorMessage);
    const it = sagaHelper(getProjectSaga(action));
    it('should set projects list loader flag to true', (result) => {
      expect(result).toEqual(put(Actions.setProjectLoader(true)));
    });
    it('should fetch project with screens', (result) => {
      expect(result).toEqual(
        call(reqWrapper, apiGetProjectWithScreens, {
          id: 10,
        }),
      );
      return {
        error,
      };
    });
    it('should put error notification', (result) => {
      expect(result).toEqual(
        put(
          enqueueSnackbar({
            message: `Error: ${errorMessage}`,
            options: { variant: 'error' },
          }),
        ),
      );
    });
  });
});
