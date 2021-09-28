import { myAxios } from '@Src/config/settings';
import { MyAxiosProps } from '@Src/types/types';
import { AxiosResponse } from 'axios';
import {
  convertResponseToPaginatedAssetLists,
  convertResponseToAssetList,
  ServerAssetList,
} from './converters/assetList/fromResponse';
import { handleError } from './helper';

export const apiGetAssetLists = (
  props: MyAxiosProps & { projectId: string },
) => {
  const { projectId, ...axiosProps } = props;
  return myAxios({
    ...axiosProps,
    method: 'GET',
    params: {
      ...(axiosProps.params || {}),
      project: projectId,
    },
    url: `/projects/illustrations/`,
  })
    .then(convertResponseToPaginatedAssetLists)
    .catch(handleError);
};

export const apiCreateAssetList = (
  props: MyAxiosProps & { projectId: string; name: string },
) => {
  const { projectId, name, ...axiosProps } = props;
  return myAxios({
    ...axiosProps,
    method: 'POST',
    url: `projects/illustrations/`,
    data: {
      ...props.data,
      project: projectId,
      name,
    },
  })
    .then((response: AxiosResponse<ServerAssetList>) => {
      return convertResponseToAssetList(response);
    })
    .catch(handleError);
};

export const apiDeleteAssetList = (props: MyAxiosProps & { id: string }) => {
  const { id, ...axiosProps } = props;
  return myAxios({
    ...axiosProps,
    method: 'DELETE',
    url: `/projects/illustrations/${id}`,
  });
};
