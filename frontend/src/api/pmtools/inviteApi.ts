import { handleError } from '@Api/helper';
import { myAxios } from '@Src/config/settings';
import {
  ToServerFetchMembers,
  RequestMember,
  ToServerPermissions,
  RequestRemoveMember,
} from '@Src/types/pmtools/actions';
import { MyAxiosProps } from '@Src/types/types';
import { AxiosResponse } from 'axios';

const fetchMembers = ({
  projectId,
  ...axiosProps
}: {
  projectId: RequestMember['project'];
} & MyAxiosProps) => {
  return myAxios({
    ...axiosProps,
    method: 'GET',
    url: `/projects/members-for-project/${projectId}`,
  })
    .then((results: AxiosResponse) => results.data.projectmember)
    .catch(handleError);
};
const addMember = ({ data, ...axiosProps }: RequestMember & MyAxiosProps) =>
  myAxios({
    ...axiosProps,
    data,
    method: 'POST',
    url: `/projects/project-members/`,
  })
    .then((results: AxiosResponse) => results.data)
    .catch(handleError);

const removeMember = ({
  id,
  ...axiosProps
}: { id: RequestRemoveMember } & MyAxiosProps) =>
  myAxios({
    ...axiosProps,
    method: 'DELETE',
    url: `/projects/project-members/${id}`,
  })
    .then(() => id)
    .catch(handleError);

const editMembers = ({ data, ...axiosProps }: RequestMember & MyAxiosProps) =>
  myAxios({
    ...axiosProps,
    data,
    method: 'PUT',
    url: `/projects/project-members/${data.id}/`,
  })
    .then((results: AxiosResponse) => results.data)
    .catch(handleError);

const getAllUsers = ({ ...axiosProps }: MyAxiosProps) =>
  myAxios({
    ...axiosProps,
    method: 'GET',
    url: `/accounts/users/`,
  })
    .then((results: AxiosResponse) => results.data.results)
    .catch(handleError);

const getPermissionsUser = ({
  data,
  ...axiosProps
}: ToServerFetchMembers & MyAxiosProps) => {
  return myAxios({
    ...axiosProps,
    data: { projectid: data.projectId },
    method: 'POST',
    url: `/projects/permissions-allusers-display/`,
  })
    .then((results: AxiosResponse) => results.data)
    .catch(handleError);
};

const updatePermissions = ({
  permissions,
  projectid,
  username,
  ...axiosProps
}: ToServerPermissions & MyAxiosProps) =>
  myAxios({
    ...axiosProps,
    data: { permissions, projectid, username },
    method: 'POST',
    url: `/projects/permissionsmap-projects-assign/`,
  })
    .then((results: AxiosResponse) => results.data)
    .catch(handleError);

const Invite = {
  getAllUsers,
  fetchMembers,
  addMember,
  removeMember,
  editMembers,
  updatePermissions,
  getPermissionsUser,
};

export default Invite;
