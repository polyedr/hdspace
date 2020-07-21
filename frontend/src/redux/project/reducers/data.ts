import { initialData } from '../initial';
import * as T from '../types';

export function dataReducer(state: T.ProjectDataState = initialData, action: T.Action): T.ProjectDataState {
  switch (action.type) {
    case 'PROJECTS:LOAD_LIBRARY_ELEMENTS_SUCCESS': {
      return { ...state, libraryElements: action.payload.libraryElements };
    }

    case 'PROJECTS:LOAD_PROJECTS_SUCCESS': {
      return { ...state, listProject: action.payload.projects };
    }

    default:
      return state;
  }
}
