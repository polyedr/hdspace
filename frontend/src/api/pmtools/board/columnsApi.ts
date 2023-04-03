import { handleError } from '@Api/helper';
import { BoardNewColumn } from '@Redux/pmtools/types';
import { myAxios } from '@Src/config/settings';
import { MyAxiosProps } from '@Src/types';

export const fetchColumns = async ({
  projectId,
  ...options
}: MyAxiosProps & { projectId: number }) =>
  await myAxios({
    url: `/projects/columns-for-project/${projectId}/`,
    method: 'get',
    ...options,
  }).catch(handleError);

export const createColumn = async ({
  title,
  colour,
  projectId,
  ...options
}: MyAxiosProps & BoardNewColumn) =>
  await myAxios({
    url: '/projects/project-columns/',
    method: 'post',
    data: {
      title,
      colour,
      project: projectId,
    },
    ...options,
  }).catch(handleError);

export const updateColumn = async ({
  fields,
  columnId,
  ...options
}: MyAxiosProps & {
  fields: any;
  columnId: number;
}) =>
  await myAxios({
    url: `/projects/project-columns/${columnId}/`,
    method: 'patch',
    data: fields,
    ...options,
  }).catch(handleError);

export const updateColumnsSequence = async ({
  projectId,
  ...options
}: MyAxiosProps & {
  projectId: number;
}) =>
  await myAxios({
    url: `/projects/project/update_children_order/${projectId}/`,
    method: 'patch',
    ...options,
  }).catch(handleError);
