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
  allUsersProjectPermissions: {
    loading: false,
    projectId: null,
    data: {},
  },
  currentUserProjectPermissions: [],
};

export default initialState;
