import { handleError } from '@Api/helper';
import { myAxios } from '@Src/config/settings';
import { MyAxiosProps } from '@Src/types';

export const createComment = ({
  text,
  taskId,
  ...options
}: MyAxiosProps & { taskId: number; text: string }) => {
  return myAxios({
    url: `/projects/columntask-comments/`,
    method: 'post',
    data: {
      text,
      columntask: taskId,
    },
    ...options,
  }).catch(handleError);
};
