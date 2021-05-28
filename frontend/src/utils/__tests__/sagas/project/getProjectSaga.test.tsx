import sagaHelper from 'redux-saga-testing';
import { put, call, select } from 'redux-saga/effects';
import {
  getProjectSaga,
  setMasterScreenCoreElements,
} from '@Redux/project/sagas/project';
import * as Actions from '@Redux/project/actions';
import { reqWrapper } from '@Redux/project/sagas/shared';
import { getScreensSaga } from '@Redux/project/sagas/screen';
import { apiGetProjectWithScreens } from '@Api/project';
import { selectScreenById } from '@Redux/project/selectors/screen';
import { enqueueSnackbar } from '@Redux/notification/actions';
import * as PermissionsActions from '../../../../redux/permissions/actions';
import {
  beforeSagaTest,
  createMasterScreenMock,
  createMockProject,
  createProjectWithScreensMock,
} from '../../test-utils';

describe('getProjectSaga Test', () => {
  beforeAll(beforeSagaTest);
  const action = Actions.getProject(10);
  const mockProject = createMockProject();
  const masterScreenMock = createMasterScreenMock(1);
  const projectWithScreens = createProjectWithScreensMock(mockProject.id);
  const masterScreenId = projectWithScreens.projectscreen[0].id;
  describe('under normal behavior', () => {
    // @ts-expect-error saga type is not compatible with IterableIterator
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

    it('should put getMyPermissionsForProject action', (result) => {
      expect(result).toEqual(
        put(
          PermissionsActions.getMyPermissionsForProject(projectWithScreens.id),
        ),
      );
    });

    it('should dispatch setProject action', (result) => {
      expect(result).toEqual(
        put(
          Actions.setProject({
            ...projectWithScreens,
            projectscreen: projectWithScreens.projectscreen.map(
              (screen) => screen.id,
            ),
          }),
        ),
      );
    });
    it('should call getScreenSaga', (result) => {
      expect(result).toEqual(
        call(getScreensSaga, projectWithScreens.projectscreen),
      );
    });
    it('put setCurrentProjectId action', (result) => {
      expect(result).toEqual(
        put(Actions.setCurrentProjectId(projectWithScreens.id)),
      );
    });
    it('put setAssetLists to null action', (result) => {
      expect(result).toEqual(put(Actions.setAssetLists(null)));
    });
    it('put setSelectedAssetList to null action', (result) => {
      expect(result).toEqual(put(Actions.setSelectedAssetListId(null)));
    });
    it('should put setMasterScreenId action', (result) => {
      expect(result).toEqual(put(Actions.setMasterScreenId(masterScreenId)));
    });

    it('should select master screen', (result) => {
      expect(result).toEqual(select(selectScreenById, masterScreenId));
      return masterScreenMock;
    });

    it('should set master screen core elements', (result) => {
      expect(result).toEqual(
        call(setMasterScreenCoreElements, masterScreenMock),
      );
    });
  });

  describe('when project with screens request fails', () => {
    const errorMessage = 'Error message';
    const error = new Error(errorMessage);
    // @ts-expect-error getProjectSaga type is not compatible with IterableIterator
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
