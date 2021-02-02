import { myAxios } from '@Src/config/settings';
import { MyAxiosProps, PaginatedArray } from '@Src/types';
import { AxiosResponse } from 'axios';
import {
  convertResponseToAsset,
  convertResponseToPaginatedAssets,
  ServerAsset,
} from './converters/asset/fromResponse';
import { handleError } from './project';

export const apiCreateAsset = (
  props: MyAxiosProps & { assetFormData: FormData },
) => {
  const { assetFormData, ...axiosProps } = props;
  return myAxios({
    ...axiosProps,
    url: `/projects/images/`,
    method: 'POST',
    contentType: 'multipart/form-data',
    data: assetFormData,
  })
    .then((response: AxiosResponse<ServerAsset>) =>
      convertResponseToAsset(response),
    )
    .catch(handleError);
};

export const apiDeleteAsset = (props: MyAxiosProps & { id: string }) => {
  const { id, ...axiosProps } = props;
  return myAxios({
    ...axiosProps,
    url: `/projects/images/${id}`,
    method: 'DELETE',
  });
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
