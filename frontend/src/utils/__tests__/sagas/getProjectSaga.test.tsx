import sagaHelper from 'redux-saga-testing';
import { put, call } from 'redux-saga/effects';
import MockDate from 'mockdate';
import { getProjectSaga } from '@Redux/project/sagas/project';
import * as Actions from '@Redux/project/actions';
import { reqWrapper } from '@Redux/project/sagas/shared';
import { getScreensSaga } from '@Redux/project/sagas/screen';
import { apiGetProjectWithScreens } from '@Api/project';
import * as PermissionsActions from '../../../redux/permissions/actions';
import {
  createMasterScreenMock,
  createMockProject,
  projectWithScreensMock,
} from '../test-utils';

describe('createProjectSaga Test', () => {
  beforeAll(() => {
    console.error = jest.fn();
    // stub current date and random value generator to pass enqueueSnackbar equality
    MockDate.set('2000-11-22');
    jest.spyOn(global.Math, 'random').mockReturnValue(0.123456789);
  });
  // @ts-ignore
  const action = Actions.getProject(10);
  // @ts-ignore
  const mockProject = createMockProject();
  const masterScreenMock = createMasterScreenMock(mockProject.id);
  const projectWithScreens = projectWithScreensMock(mockProject.id);
  describe('WHEN method is called and API is in its working state', () => {
    // @ts-ignore
    const it = sagaHelper(getProjectSaga(action));

    it('should set projects list loader flag to true', (result) => {
      expect(result).toEqual(put(Actions.setProjectLoader(true)));
    });
    it('test 1', (result) => {
      expect(result).toEqual(
        call(reqWrapper, apiGetProjectWithScreens, {
          id: 10,
        }),
      );
      return {
        result: projectWithScreens,
      };
    });

    it('test 2', (result) => {
      expect(result).toEqual(
        put(
          PermissionsActions.getMyPermissionsForProject(projectWithScreens.id),
        ),
      );
    });

    it('test 3', (result) => {
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
    it('test call', (result) => {
      expect(result).toEqual(
        call(getScreensSaga, projectWithScreens.projectscreen),
      );
    });
    it('test 4', (result) => {
      expect(result).toEqual(
        put(Actions.setCurrentProjectId(projectWithScreens.id)),
      );
    });
    it('test 5', (result) => {
      expect(result).toEqual(
        put(Actions.setMasterScreenId(masterScreenMock.id)),
      );
    });
  });
});
