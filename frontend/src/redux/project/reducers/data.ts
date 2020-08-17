import { initialData } from '../initial';
import * as T from '../types';
import { TYPES } from '$constants/actions';

export function dataReducer(
  state: T.ProjectDataState = initialData,
  action: T.Action,
): T.ProjectDataState {
  switch (action.type) {
    case TYPES.LOAD_LIBRARY_ELEMENTS_SUCCESS: {
      return { ...state, libraryElements: action.payload.libraryElements };
    }

    case TYPES.LOAD_PROJECTS_SUCCESS: {
      return { ...state, listProject: action.payload.projects };
    }

    case TYPES.LOGOUT: {
      return {
        ...initialData,
      };
    }

    default:
      return state;
  }
}
