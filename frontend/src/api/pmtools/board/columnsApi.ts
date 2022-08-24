import { handleError } from '@Api/helper';
import { myAxios } from '@Src/config/settings';
import { MyAxiosProps } from '@Src/types';

export const fetchColumns = ({
  projectId,
  ...options
}: MyAxiosProps & { projectId: number }) => {
  return myAxios({
    url: `/projects/columns-for-project/${projectId}/`,
    method: 'get',
    ...options,
  }).catch(handleError);
};

export const fetchTasks = ({ projectId, ...options }) => {
  return myAxios({
    url: `/projects/column-tasks/?column__project=${projectId}`,
    method: 'get',
    ...options,
  }).catch(handleError);
};

export const createColumn = ({
  title,
  description,
  projectId,
  ...options
}: MyAxiosProps & {
  title: string;
  description: string;
  projectId: number;
}) => {
  return myAxios({
    url: `/projects/project-columns/`,
    method: 'post',
    data: {
      title,
      description,
      project: projectId,
    },
    ...options,
  }).catch(handleError);
};
