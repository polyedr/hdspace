import sagaHelper from 'redux-saga-testing';
import { put, select, call } from 'redux-saga/effects';
import MockDate from 'mockdate';

import {
  createProjectSaga,
  createMasterScreenElements,
} from '@Redux/project/sagas/project';
import * as Actions from '@Redux/project/actions';
import { selectProjectsAsArr } from '@Redux/project/selectors/base';
import { reqWrapper } from '@Redux/project/sagas/shared';
import { createScreenSaga } from '@Redux/project/sagas/screen';
import { apiCreateProject } from '@Api/project';
import {
  DEFAULT_ASSET_LIST_NAME,
  DEFAULT_PROJECT,
} from '@Constants/defaultParams';
import { apiCreateAssetList } from '@Api/assetList';
import { enqueueSnackbar } from '@Redux/notification/actions';
import { convertCreatedProjectToRequest } from '@Api/converters/toRequest';
import { UserProjectPermission } from '@Src/types';
import * as PermissionsActions from '../../../redux/permissions/actions';
import {
  createAssetListMock,
  createMasterScreenMock,
  createMockProject,
  createScreenMock,
} from '../test-utils';

describe('createProjectSaga Test', () => {
  beforeAll(() => {
    // eslint-disable-next-line no-console
    console.error = jest.fn();
    // stub current date and random value generator to pass enqueueSnackbar equality
    MockDate.set('2000-11-22');
    jest.spyOn(global.Math, 'random').mockReturnValue(0.123456789);
  });
  // @ts-ignore
  const action = Actions.createProject('test project');
  // @ts-ignore
  const assetListMock = createAssetListMock();
  const mockProject = createMockProject();
  const masterScreenMock = createMasterScreenMock(mockProject.id);
  const screenMock = createScreenMock(mockProject.id);
  describe('WHEN method is called and API is in its working state', () => {
    // @ts-ignore
    const it = sagaHelper(createProjectSaga(action));

    it('should set projects list loader flag to true', (result) => {
      expect(result).toEqual(put(Actions.setProjectCreateLoader(true)));
    });
    it('request to create a new project', (result) => {
      expect(result).toEqual(
        call(reqWrapper, apiCreateProject, {
          data: convertCreatedProjectToRequest('test project'),
        }),
      );
      return {
        result: mockProject,
      };
    });

    it('set current user rights', (result) => {
      expect(result).toEqual(
        put(
          PermissionsActions.setStateCurrentUserPermissions([
            UserProjectPermission.VIEW_PROJECT,
            UserProjectPermission.CHANGE_PROJECT,
          ]),
        ),
      );
    });
    it('get an asset list', (result) => {
      expect(result).toEqual(
        call(reqWrapper, apiCreateAssetList, {
          projectId: mockProject.id,
          name: DEFAULT_ASSET_LIST_NAME,
        }),
      );
      return assetListMock;
    });
    it('add asset list to state', (result) => {
      expect(result).toEqual(
        put(
          Actions.addAssetListToState(assetListMock, {
            useHistory: true,
          }),
        ),
      );
    });
    it('get a list of all projects', (result) => {
      expect(result).toEqual(select(selectProjectsAsArr));
      return [DEFAULT_PROJECT];
    });
    it('set the created project and new projects to state', (result) => {
      expect(result).toEqual(
        put(Actions.setProjectList([...[DEFAULT_PROJECT], mockProject])),
      );
    });
    it('set Current Project Id', (result) => {
      expect(result).toEqual(put(Actions.setCurrentProjectId(mockProject.id)));
    });
    it('get a new master screen for the project', (result) => {
      expect(result).toEqual(
        call(
          createScreenSaga,
          Actions.createScreen(
            {
              projectID: mockProject.id,
              name: masterScreenMock.name,
              buoyancy: masterScreenMock.buoyancy,
              rootName: masterScreenMock.name,
            },
            {
              useHistory: true,
            },
          ),
        ),
      );
      return masterScreenMock;
    });
    it('create Master Screen Elements', (result) => {
      expect(result).toEqual(
        call(createMasterScreenElements, masterScreenMock),
      );
    });
    it('create screen for new project', (result) => {
      expect(result).toEqual(
        call(
          createScreenSaga,
          Actions.createScreen(
            {
              projectID: mockProject.id,
              name: screenMock.name,
              buoyancy: screenMock.buoyancy,
            },
            {
              useHistory: true,
            },
          ),
        ),
      );
      return screenMock;
    });
    it('set Master Screen Id in state', (result) => {
      expect(result).toEqual(
        put(Actions.setMasterScreenId(masterScreenMock.id)),
      );
    });
    it('display a successful message about creating a new project', (result) => {
      expect(result).toEqual(
        put(
          enqueueSnackbar({
            message: `Project ${mockProject.name} created`,
            options: {
              variant: 'success',
            },
          }),
        ),
      );
    });
    it('add successful flag about creation neww screen modal', (result) => {
      expect(result).toEqual(put(Actions.setNewScreenModal(true)));
    });
  });
  describe('WHEN method is called and API returns an error', () => {
    // @ts-ignore
    const it = sagaHelper(createProjectSaga(action));
    it('should set projects list loader flag to true', (result) => {
      expect(result).toEqual(put(Actions.setProjectCreateLoader(true)));
    });
    it('error request to create a new project', (result) => {
      expect(result).toEqual(
        call(reqWrapper, apiCreateProject, {
          data: convertCreatedProjectToRequest('test project'),
        }),
      );
      return {
        error: new Error('test error'),
      };
    });
    it('displaying an error message when creating a new project', (result) => {
      expect(result).toEqual(
        put(
          enqueueSnackbar(
            {
              message: 'Error: test error',
              options: {
                variant: 'error',
              },
            },
            new Error('test error'),
          ),
        ),
      );
    });
    it('should set projects list loader flag to false', (result) => {
      expect(result).toEqual(put(Actions.setProjectCreateLoader(false)));
    });
  });
});
