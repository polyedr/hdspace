import { handleError } from '@Api/helper';
import { myAxios } from '@Src/config/settings';
import {
  ToServerFetchMembers,
  ToServerMember,
  ToServerPermissions,
} from '@Src/types/pmtools/api';
import { AxiosResponse } from 'axios';

const fetchMembers = ({ projectId, access }: ToServerFetchMembers) =>
  myAxios({
    access,
    method: 'GET',
    url: `/projects/members-for-project/${projectId}`,
  })
    .then((results: AxiosResponse) => results.data.projectmember)
    .catch(handleError);

const addMember = (data: ToServerMember) =>
  myAxios({
    access: data.access,
    data,
    method: 'POST',
    url: `/projects/project-members/`,
  })
    .then((results: AxiosResponse) => results.data)
    .catch(handleError);

const removeMember = ({ id, access }) =>
  myAxios({
    access,
    method: 'DELETE',
    url: `/projects/project-members/${id}`,
  })
    .then(() => id)
    .catch(handleError);

const editMembers = (data: ToServerMember) =>
  myAxios({
    access: data.access,
    data,
    method: 'PUT',
    url: `/projects/project-members/${data.id}/`,
  })
    .then((results: AxiosResponse) => results.data)
    .catch(handleError);

const getAllUsers = (access) =>
  myAxios({
    access,
    method: 'GET',
    url: `/accounts/users/`,
  })
    .then((results: AxiosResponse) => results.data.results)
    .catch(handleError);

const getPermissionsUser = (data: ToServerFetchMembers) =>
  myAxios({
    access: data.access,
    data: { projectid: data.projectId },
    method: 'POST',
    url: `/projects/permissions-allusers-display/`,
  })
    .then((results: AxiosResponse) => results.data)
    .catch(handleError);

const editPermissions = (data: ToServerPermissions) =>
  myAxios({
    access: data.access,
    data,
    method: 'POST',
    url: `/projects/permissionsmap-projects-assign/`,
  })
    .then((results: AxiosResponse) => results.data.permissions)
    .catch(handleError);

const Invite = {
  getAllUsers,
  fetchMembers,
  addMember,
  removeMember,
  editMembers,
  editPermissions,
  getPermissionsUser,
};

export default Invite;
