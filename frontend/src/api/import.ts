/* eslint-disable import/prefer-default-export */
import { myAxios } from '@Src/config/settings';
import { MyAxiosProps } from '@Src/types';

export const apiPostURL = ({
  wpurl,
  ...props
}: MyAxiosProps & { wpurl: string }) => {
  return myAxios({
    ...props,
    url: '/uploadapps/webpages/',
    method: 'POST',
    contentType: 'application/json',
    data: {
      wpurl,
    },
  });
};
