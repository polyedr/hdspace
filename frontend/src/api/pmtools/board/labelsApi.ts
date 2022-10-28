import { handleError } from '@Api/helper';
import { myAxios } from '@Src/config/settings';
import { MyAxiosProps } from '@Src/types';

export const fetchLabels = ({
  projectId,
  ...options
}: MyAxiosProps & { projectId: number }) => {
  return myAxios({
    url: `/projects/columns-for-project/${projectId}/`,
    method: 'get',
    ...options,
  }).catch(handleError);
};

export const createProjectLabel = ({
  text,
  colour,
  projectId,
  ...options
}: MyAxiosProps & { text: string; colour: string; projectId: number }) => {
  return myAxios({
    url: `/projects/columntask-labels/`,
    method: 'post',
    data: {
      colour,
      text,
      columntask: [],
      project: projectId,
    },
    ...options,
  }).catch(handleError);
};

export const updateLabel = ({
  text,
  colour,
  labelId,
  ...options
}: MyAxiosProps & { text: string; colour: string; labelId: number }) => {
  return myAxios({
    url: `/projects/columntask_labels/${labelId}/`,
    method: 'patch',
    data: {
      colour,
      text,
    },
    ...options,
  }).catch(handleError);
};

export const deleteLabel = ({
  labelId,
  ...options
}: MyAxiosProps & { labelId: number }) => {
  return myAxios({
    url: `/projects/columntask_labels/${labelId}/`,
    method: 'delete',
    ...options,
  }).catch(handleError);
};

export const updateTaskLabels = ({
  text,
  colour,
  labelId,
  ...options
}: MyAxiosProps & { text: string; colour: string; labelId: number }) => {
  return myAxios({
    url: `/projects/columntask_labels/${labelId}/`,
    method: 'post',
    data: {
      colour,
      text,
    },
    ...options,
  }).catch(handleError);
};
