import sagaHelper from 'redux-saga-testing';
import { updateNameAndTagsProjectSaga } from '@Redux/project/sagas/project';
import * as Actions from '@Redux/project/actions';
import { select, call, put } from 'redux-saga/effects';
import { selectProjectById } from '@Redux/project/selectors/base';
import { apiUpdateProject } from '@Api/project';
import { reqWrapper } from '@Redux/project/sagas/shared';
import { enqueueSnackbar } from '@Redux/notification/actions';
import { createMockProject, beforeSagaTest } from '../../test-utils';

describe('update name and tags project saga', () => {
  beforeAll(beforeSagaTest);
  const mockProject = createMockProject();
  const testName = 'test name';
  const tags = 'tags';
  const tagsArray = ['tags'];
  const action = Actions.updateNameAndTagsProject(
    mockProject.id,
    testName,
    tags,
  );
  describe('under normal behavior', () => {
    const it = sagaHelper(updateNameAndTagsProjectSaga(action));

    it('should select project', (result) => {
      expect(result).toEqual(select(selectProjectById, mockProject.id));
      return mockProject;
    });

    it('should call apiUpdateProject request', (result) => {
      expect(result).toEqual(
        call(reqWrapper, apiUpdateProject, {
          data: {
            id: mockProject.id,
            name: testName,
            tags: tagsArray,
            projectscreen: mockProject.projectscreen,
          },
        }),
      );
      return {
        result: mockProject,
      };
    });

    it('should set project', (result) => {
      expect(result).toEqual(put(Actions.setProject(mockProject)));
    });
  });

  describe('if api request fails', () => {
    const it = sagaHelper(updateNameAndTagsProjectSaga(action));
    const errorMessage = 'Error message';
    const error = new Error(errorMessage);

    it('should select project', (result) => {
      expect(result).toEqual(select(selectProjectById, mockProject.id));
      return mockProject;
    });

    it('should call apiUpdateProject request', (result) => {
      expect(result).toEqual(
        call(reqWrapper, apiUpdateProject, {
          data: {
            id: mockProject.id,
            name: testName,
            tags: tagsArray,
            projectscreen: mockProject.projectscreen,
          },
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
