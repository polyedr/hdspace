import { handleError } from '@Api/helper';
import { BoardTaskCheckListItem } from '@Redux/pmtools/types';
import { myAxios } from '@Src/config/settings';
import { MyAxiosProps } from '@Src/types';

export const createCheckItem = ({
  text,
  taskId,
  ...options
}: MyAxiosProps & { text: string; taskId: number }) => {
  return myAxios({
    url: `/projects/columntask-checkitems/`,
    method: 'post',
    data: {
      text,
      columntask: taskId,
    },
    ...options,
  }).catch(handleError);
};

export const updateCheckItem = ({
  item,
  checkItemId,
  ...options
}: MyAxiosProps & {
  item: Partial<BoardTaskCheckListItem>;
  checkItemId: number;
}) => {
  return myAxios({
    url: `/projects/columntask_checkitems/${checkItemId}/`,
    method: 'patch',
    data: item,
    ...options,
  }).catch(handleError);
};

export const deleteCheckItem = ({
  checkItemId,
  ...options
}: MyAxiosProps & { checkItemId: number }) => {
  return myAxios({
    url: `/projects/columntask_checkitems/${checkItemId}/`,
    method: 'delete',
    ...options,
  }).catch(handleError);
};

export const deleteAllCheckItems = ({
  taskId,
  ...options
}: MyAxiosProps & { taskId: number }) => {
  return myAxios({
    url: `/projects/columntask-checkitems-delete/?task_id=${taskId}`,
    method: 'delete',
    ...options,
  }).catch(handleError);
};
