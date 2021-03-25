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
  usersPermissions: {},
  myProjectPermissions: [],
  projectUsersData: {
    next: null,
    previous: null,
    results: {},
    pageSize: 10,
    loading: false,
  },
};

export default initialState;
