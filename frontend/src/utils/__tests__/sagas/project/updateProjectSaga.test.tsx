import sagaHelper from 'redux-saga-testing';
import { call, put, select } from 'redux-saga/effects';
import { updateProjectSaga } from '@Redux/project/sagas/project';
import * as Actions from '@Redux/project/actions';
import { selectCurrentProject } from '@Redux/project/selectors/base';
import { projectUpdateHelperSaga } from '@Redux/project/sagas/shared';
import { enqueueSnackbar } from '@Redux/notification/actions';
import {
  beforeSagaTest,
  createMockProject,
  mockProject,
} from '../../test-utils';

describe('updateProjectSaga', () => {
  beforeAll(beforeSagaTest);
  const action = Actions.updateProject(mockProject);
  const currentProject = createMockProject();
  describe('under normal behavior', () => {
    const it = sagaHelper(updateProjectSaga(action));
    it('should select current project', (result) => {
      expect(result).toEqual(select(selectCurrentProject));
      return currentProject;
    });

    it('should call projectUpdateHelperSaga', (result) => {
      expect(result).toEqual(call(projectUpdateHelperSaga, mockProject));
      return true;
    });

    it('should add undo action', (result) => {
      expect(result).toEqual(
        put(
          Actions.addUndoActions(
            Actions.updateProject(currentProject, { ...action.meta }),
          ),
        ),
      );
    });
  });

  describe('when projectUpdateHelperSaga fails', () => {
    const it = sagaHelper(updateProjectSaga(action));
    it('should select current project', (result) => {
      expect(result).toEqual(select(selectCurrentProject));
      return currentProject;
    });

    it('should call projectUpdateHelperSaga', (result) => {
      expect(result).toEqual(call(projectUpdateHelperSaga, mockProject));
      return false;
    });

    it('should display error notification', (result) => {
      expect(result).toEqual(
        put(
          enqueueSnackbar({
            message: `Failed to update project ${mockProject.name}`,
            options: {
              variant: 'error',
            },
          }),
        ),
      );
    });
  });
});
