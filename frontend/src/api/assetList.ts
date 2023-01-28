import { myAxios } from '@Src/config/settings';
import { MyAxiosProps } from '@Src/types';
import { AxiosResponse } from 'axios';
import {
  convertResponseToPaginatedAssetLists,
  convertResponseToAssetList,
  ServerAssetList,
} from './converters/assetList/fromResponse';
import { handleError } from './helper';

export const apiGetAssetLists = async (
  props: MyAxiosProps & { projectId: string },
) => {
  const { projectId, ...axiosProps } = props;
  return await myAxios({
    ...axiosProps,
    method: 'GET',
    params: {
      ...(axiosProps.params || {}),
      project: projectId,
    },
    url: '/projects/illustrations/',
  })
    .then(convertResponseToPaginatedAssetLists)
    .catch(handleError);
};

export const apiCreateAssetList = async (
  props: MyAxiosProps & { projectId: string; name: string },
) => {
  const { projectId, name, ...axiosProps } = props;
  return await myAxios({
    ...axiosProps,
    method: 'POST',
    url: 'projects/illustrations/',
    data: {
      ...props.data,
      project: projectId,
      name,
    },
  })
    .then((response: AxiosResponse<ServerAssetList>) =>
      convertResponseToAssetList(response),
    )
    .catch(handleError);
};

export const apiDeleteAssetList = async (
  props: MyAxiosProps & { id: string },
) => {
  const { id, ...axiosProps } = props;
  return await myAxios({
    ...axiosProps,
    method: 'DELETE',
    url: `/projects/illustrations/${id}`,
  });
};
