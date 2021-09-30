import TYPES from '@Redux/actionTypes';
import {
  RequestPermissions,
  ToServerSearchMember,
} from '@Src/types/pmtools/actions';

export const searchLoader = (payload: boolean) => ({
  type: TYPES.SEARCH_LOADER,
  payload,
});

export const clearSearch = () => ({ type: TYPES.CLEAR_SEARCH });

export const requestSearchAction = (payload: ToServerSearchMember) => ({
  type: TYPES.SEARCH,
  payload,
});

export const successSearchAction = (payload: RequestPermissions) => ({
  type: TYPES.SEARCH_SUCCESS,
  payload,
});
