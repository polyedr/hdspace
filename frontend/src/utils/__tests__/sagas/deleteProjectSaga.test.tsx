import sagaHelper from 'redux-saga-testing';
import { put, select, call } from 'redux-saga/effects';
import { deleteProjectSaga } from '@Redux/project/sagas/project';
import * as Actions from '@Redux/project/actions';
import { selectProjectsAsArr } from '@Redux/project/selectors/base';
import { reqWrapper } from '@Redux/project/sagas/shared';
import { apiDeleteProject } from '@Api/project';
import { enqueueSnackbar } from '@Redux/notification/actions';
import { mockProject, beforeSagaTest } from '../test-utils';

describe('deleteProjectSaga Test', () => {
  beforeAll(beforeSagaTest);
  const action = Actions.deleteProject(10);
  describe('WHEN method is called and API is in its working state', () => {
    // @ts-ignore
    const it = sagaHelper(deleteProjectSaga(action));
    it('request to delete a project', (result) => {
      expect(result).toEqual(
        call(reqWrapper, apiDeleteProject, {
          id: 10,
        }),
      );
      return {
        result: true,
      };
    });

    it('get an array of projects', (result) => {
      expect(result).toEqual(select(selectProjectsAsArr));
      return [mockProject];
    });

    it('set a new project list', (result) => {
      expect(result).toEqual(put(Actions.setProjectList([mockProject])));
    });
    it('show a message about successful deletion', (result) => {
      expect(result).toEqual(
        put(
          enqueueSnackbar({
            message: `Project deleted`,
            options: {
              variant: 'success',
            },
          }),
        ),
      );
    });

    describe('WHEN method is called and API returns an error', () => {
      // @ts-ignore
      const it = sagaHelper(deleteProjectSaga(action));

      it('error when requesting deletion', (result) => {
        expect(result).toEqual(
          call(reqWrapper, apiDeleteProject, {
            id: 10,
          }),
        );
        return {
          error: new Error('test error'),
        };
      });
      it('show an error message when deleting a project', (result) => {
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
    });
  });
});
