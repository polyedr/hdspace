import { handleError } from '@Api/helper';
import { myAxios } from '@Src/config/settings';
import {
  ToServerFetchMembers,
  ToServerMember,
  ToServerPermissions,
  ToServerRemoveMember,
} from '@Src/pm-types/invite/api';
import { AxiosResponse } from 'axios';
import api from './common/apiController';
import getToken from './common/getToken';

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

const removeMember = (data: ToServerRemoveMember) =>
  myAxios({
    access: data.access,
    method: 'DELETE',
    url: `/projects/project-members/${data.id}`,
  })
    .then(() => data.id)
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

async function getAllUsers() {
  try {
    const config = await getToken();
    const res: AxiosResponse = await api.get('/accounts/users/', config);
    return res.data.results;
  } catch (e) {
    return e;
  }
}

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
