import { handleError } from '@Api/helper';
import { BoardTaskCheckListItem } from '@Redux/pmtools/types';
import { myAxios } from '@Src/config/settings';
import { MyAxiosProps } from '@Src/types';

export const createCheckItem = async ({
  text,
  taskId,
  ...options
}: MyAxiosProps & { text: string; taskId: number }) =>
  await myAxios({
    url: '/projects/columntask-checkitems/',
    method: 'post',
    data: {
      text,
      columntask: taskId,
    },
    ...options,
  }).catch(handleError);

export const updateCheckItem = async ({
  item,
  checkItemId,
  ...options
}: MyAxiosProps & {
  item: Partial<BoardTaskCheckListItem>;
  checkItemId: number;
}) =>
  await myAxios({
    url: `/projects/columntask_checkitems/${checkItemId}/`,
    method: 'patch',
    data: item,
    ...options,
  }).catch(handleError);

export const deleteCheckItem = async ({
  checkItemId,
  ...options
}: MyAxiosProps & { checkItemId: number }) =>
  await myAxios({
    url: `/projects/columntask_checkitems/${checkItemId}/`,
    method: 'delete',
    ...options,
  }).catch(handleError);

export const deleteAllCheckItems = async ({
  taskId,
  ...options
}: MyAxiosProps & { taskId: number }) =>
  await myAxios({
    url: `/projects/columntask-checkitems-delete/?task_id=${taskId}`,
    method: 'delete',
    ...options,
  }).catch(handleError);
