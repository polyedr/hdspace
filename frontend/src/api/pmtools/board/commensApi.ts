import { handleError } from '@Api/helper';
import { myAxios } from '@Src/config/settings';
import { MyAxiosProps } from '@Src/types';

export const createComment = ({
  projectId,
  ...options
}: MyAxiosProps & { projectId: number }) => {
  return myAxios({
    url: `/projects/columns-for-project/${projectId}/`,
    method: 'get',
    ...options,
  }).catch(handleError);
};
