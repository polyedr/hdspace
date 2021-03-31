import { PermissionsState } from '@Redux/types';

const initialState: PermissionsState = {
  allUsersList: {
    next: null,
    previous: null,
    results: {},
    pageSize: 10,
    loading: false,
    search: '',
  },
  projectUsersPermissionsList: {
    loading: false,
    projectId: null,
    data: {},
  },
  currentUserProjectPermissions: [],
};

export default initialState;
