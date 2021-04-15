import sagaHelper from 'redux-saga-testing';
import { select } from 'redux-saga/effects';
import MockDate from 'mockdate';

import { renameProjects } from '@Redux/project/sagas/project';
import * as Actions from '@Redux/project/actions';
import { selectProjectById } from '@Redux/project/selectors/base';
import { createMockProject } from '../test-utils';

describe('renameProjects Test', () => {
  beforeAll(() => {
    // eslint-disable-next-line no-console
    console.error = jest.fn();
    // stub current date and random value generator to pass enqueueSnackbar equality
    MockDate.set('2000-11-22');
    jest.spyOn(global.Math, 'random').mockReturnValue(0.123456789);
  });
  const mockProject = createMockProject();
  const action = Actions.renameProject(mockProject.id, mockProject.name);
  describe('WHEN method is called and API is in its working state', () => {
    // @ts-ignore
    const it = sagaHelper(renameProjects(action));
    it('test 1', (result) => {
      expect(result).toEqual(select(selectProjectById(mockProject.id)));
      return mockProject;
    });
  });
});
