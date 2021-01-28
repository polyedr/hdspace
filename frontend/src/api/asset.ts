import { myAxios } from '@Src/config/settings';
import { MyAxiosProps, PaginatedArray } from '@Src/types';
import { AxiosResponse } from 'axios';
import {
  convertResponseToAsset,
  convertResponseToPaginatedAssets,
  ServerAsset,
} from './converters/asset/fromResponse';
import { handleError } from './project';

export const apiGetAsset = (props: MyAxiosProps & { imageId: string }) => {
  const { imageId, ...axiosProps } = props;
  return myAxios({
    ...axiosProps,
    url: `/projects/images/${imageId}`,
    method: 'GET',
    params: {
      ...(axiosProps.params || {}),
    },
  })
    .then(() => {})
    .catch(handleError);
};

export const apiCreateAsset = (
  props: MyAxiosProps & { projectId: string; illustrationId: string },
) => {
  const { projectId, illustrationId, ...axiosProps } = props;
  return myAxios({
    ...axiosProps,
    url: `/projects/${projectId}/images/`,
    method: 'POST',
    params: {
      ...(axiosProps.params || {}),
      illustration_id: illustrationId,
    },
  })
    .then((response: AxiosResponse<ServerAsset>) =>
      convertResponseToAsset(response),
    )
    .catch(handleError);
};

export const apiGetAssets = (
  props: MyAxiosProps & { assetListId?: string },
) => {
  const { assetListId, ...axiosProps } = props;
  return myAxios({
    ...axiosProps,
    url: `/projects/images/`,
    method: 'GET',
    params: {
      ...(axiosProps.params || {}),
      illustration_set: assetListId,
    },
  })
    .then((response: AxiosResponse<PaginatedArray<ServerAsset>>) =>
      convertResponseToPaginatedAssets(response),
    )
    .catch(handleError);
};
