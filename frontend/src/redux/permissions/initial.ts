import { PermissionsState } from '@Redux/types';

const initialState: PermissionsState = {
  usersPermissionsListData: {
    next: null,
    previous: null,
    results: {},
    pageSize: 10,
    loading: false,
    search: '',
  },
  allProjectsUsersPermissions: {
    loading: false,
    data: {},
  },
  currentUserProjectPermissions: [],
};

export default initialState;
