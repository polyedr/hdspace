import { handleError } from '@Api/helper';
import { myAxios } from '@Src/config/settings';
import {
  ToServerFetchMemberList,
  ToServerMember,
  ToServerRemoveMember,
} from '@Src/pm-types/invite/api';
import { AxiosResponse } from 'axios';
import api from './common/apiController';
import getToken from './common/getToken';

const fetchMembers = ({ projectId, access }: ToServerFetchMemberList) =>
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

async function getPermissionsUser(projectid: number) {
  try {
    const config = await getToken();
    const res: AxiosResponse = await api.post(
      '/projects/permissions-allusers-display/',
      { projectid },
      config,
    );
    return res.data;
  } catch (e) {
    return e;
  }
}

async function editPermissions(data: any) {
  try {
    const config = await getToken();
    const res: AxiosResponse = await api.post(
      '/projects/permissionsmap-projects-assign/',
      data,
      config,
    );
    return res.data;
  } catch (e) {
    return e;
  }
}

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
