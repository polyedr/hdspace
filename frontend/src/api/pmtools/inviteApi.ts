import { myAxios } from '@Src/config/settings';
import { MyAxiosProps } from '@Src/types';
import { AxiosResponse } from 'axios';
import api from './common/apiController';
import getToken from './common/getToken';

export const apiGetMembersList = (props: MyAxiosProps): Promise<any> =>
  myAxios({
    ...props,
    method: 'GET',
    url: '/projects/projects/',
  }).then((response: any) => console.log(response));
// .then((result: AxiosResponse<PaginatedResponse<ServerProject>>) => ({
//   result: {
//     next: parseCursor(result.data.next),
//     previous: parseCursor(result.data.previous),
//     results: result.data.results.map(convertProjectFromResponse),
//   },
// }))
// .catch(handleError);

async function fetchMembers(id: number) {
  try {
    const config = await getToken();
    const res: AxiosResponse<any> = await api.get(
      `/projects/members-for-project/${id}`,
      config,
    );
    return res.data.projectmember;
  } catch (e) {
    return e;
  }
}

async function addMember(data: any) {
  try {
    const config = await getToken();
    const res: AxiosResponse<any> = await api.post(
      `/projects/project-members/`,
      data,
      config,
    );
    return res.data;
  } catch (e) {
    return e;
  }
}

async function removeMember(id: number) {
  try {
    const config = await getToken();
    await api.delete(`/projects/project-members/${id}`, config);
    return id;
  } catch (e) {
    return e;
  }
}

async function editMembers(data: any) {
  try {
    const config = await getToken();
    await api.put(`/projects/project-members/${data.id}/`, data, config);
    return data;
  } catch (e) {
    return e;
  }
}

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
