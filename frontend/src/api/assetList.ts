import { myAxios } from '@Src/config/settings';
import { MyAxiosProps } from '@Src/types';
import { AxiosResponse } from 'axios';
import {
  convertResponseToPaginatedAssetLists,
  convertResponseToAssetList,
  ServerAssetList,
  convertFromServerAssetList,
} from './converters/assetList/fromResponse';
import { handleError } from './project';

export const apiGetAssetLists = (
  props: MyAxiosProps & { projectId: string },
) => {
  const { projectId, ...axiosProps } = props;
  return myAxios({
    ...axiosProps,
    method: 'GET',
    params: {
      ...(axiosProps.params || {}),
      projectId,
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

export const apiGetAssetList = (
  props: MyAxiosProps & { projectId: string; illustrationId: string },
) => {
  const { illustrationId, ...axiosProps } = props;
  myAxios({
    ...axiosProps,
    method: 'GET',
    url: `/projects/illustrations/${illustrationId}/`,
  })
    .then((response) => convertFromServerAssetList(response.data))
    .catch(handleError);
};
