import { initial } from '../initial';
import * as T from '../types';

export function dataReducer(state: T.ReduxState['data'] = initial.data, action: T.Action): T.ReduxState['data'] {
  switch (action.type) {
    case 'PROJECTS:LOAD_LIBRARY_ELEMENTS_SUCCESS': {
      return { ...state, libraryElements: action.payload.libraryElements };
    }

    case 'PROJECTS:LOAD_PROJECTS_SUCCESS': {
      return { ...state, listProject: action.payload.projects };
    }
    default: return state;
  }
}
