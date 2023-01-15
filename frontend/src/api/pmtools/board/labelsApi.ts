import { handleError } from '@Api/helper';
import { myAxios } from '@Src/config/settings';
import { MyAxiosProps } from '@Src/types';

export const fetchLabels = async ({
  projectId,
  ...options
}: MyAxiosProps & { projectId: number }) =>
  await myAxios({
    url: `/projects/columns-for-project/${projectId}/`,
    method: 'get',
    ...options,
  }).catch(handleError);

export const createProjectLabel = async ({
  text,
  colour,
  projectId,
  ...options
}: MyAxiosProps & { text: string; colour: string; projectId: number }) =>
  await myAxios({
    url: '/projects/columntask-labels/',
    method: 'post',
    data: {
      colour,
      text,
      columntask: [],
      project: projectId,
    },
    ...options,
  }).catch(handleError);

export const updateLabel = async ({
  text,
  colour,
  labelId,
  ...options
}: MyAxiosProps & { text: string; colour: string; labelId: number }) =>
  await myAxios({
    url: `/projects/columntask_labels/${labelId}/`,
    method: 'patch',
    data: {
      colour,
      text,
    },
    ...options,
  }).catch(handleError);

export const deleteLabel = async ({
  labelId,
  ...options
}: MyAxiosProps & { labelId: number }) =>
  await myAxios({
    url: `/projects/columntask_labels/${labelId}/`,
    method: 'delete',
    ...options,
  }).catch(handleError);

export const updateTaskLabels = async ({
  text,
  colour,
  labelId,
  ...options
}: MyAxiosProps & { text: string; colour: string; labelId: number }) =>
  await myAxios({
    url: `/projects/columntask_labels/${labelId}/`,
    method: 'post',
    data: {
      colour,
      text,
    },
    ...options,
  }).catch(handleError);
