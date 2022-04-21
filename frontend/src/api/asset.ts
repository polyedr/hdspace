import { myAxios } from '@Src/config/settings';
import {
  Asset,
  MyAxiosProps,
  PaginatedArray,
  ParsedImagePalette,
  Result,
} from '@Src/types';
import { AxiosResponse } from 'axios';
import {
  convertResponseToAsset,
  convertResponseToImagePalette,
  convertResponseToPaginatedAssets,
  convertToServerAsset,
  ServerAsset,
  ServerImagePalette,
} from './converters/asset/fromResponse';
import { handleError } from './helper';

export const apiGetAsset = (props: MyAxiosProps & { id: string }) => {
  const { id, ...axiosProps } = props;
  return myAxios({
    ...axiosProps,
    method: 'GET',
    url: `/projects/images/${id}`,
  }).then((res) => convertResponseToAsset(res));
};

export const apiCreateAsset = (
  props: MyAxiosProps & { assetFormData: FormData },
): Promise<Result<Asset>> => {
  const { assetFormData, ...axiosProps } = props;
  return myAxios({
    ...axiosProps,
    url: `/projects/images/`,
    method: 'POST',
    contentType: 'multipart/form-data',
    data: assetFormData,
  })
    .then((response: AxiosResponse<ServerAsset>) => ({
      result: convertResponseToAsset(response),
    }))
    .catch(handleError);
};

export const apiDeleteAsset = (
  props: MyAxiosProps & {
    id: string;
  },
) => {
  const { id, ...axiosProps } = props;
  return myAxios({
    ...axiosProps,
    url: `/projects/images/${id}/`,
    method: 'PATCH',
    data: {
      illustration_set: null,
    },
  })
    .then((response: AxiosResponse<ServerAsset>) =>
      convertResponseToAsset(response),
    )
    .catch(handleError);
};

export const apiUpdateAsset = (
  props: MyAxiosProps & {
    id: string;
    asset: Partial<Asset>;
  },
) => {
  const { id, asset, ...axiosProps } = props;
  return myAxios({
    ...axiosProps,
    url: `/projects/images/${id}/`,
    method: 'PATCH',
    data: convertToServerAsset(asset),
  });
};

export const apiGetAssets = (
  props: MyAxiosProps & { assetListId?: string; next: string },
) => {
  const { assetListId, next, ...axiosProps } = props;
  return myAxios({
    ...axiosProps,
    url: next || `/projects/images/`,
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

export const apiGenerateImagePalette = (
  props: MyAxiosProps & { imageUrl: string },
): Promise<ParsedImagePalette | { error: any }> => {
  const { imageUrl, ...axiosProps } = props;
  return myAxios({
    ...axiosProps,
    url: `/projects/images_palette/`,
    method: 'POST',
    data: { fileurl: imageUrl },
  })
    .then((response: AxiosResponse<ServerImagePalette>) => {
      return convertResponseToImagePalette(response);
    })
    .catch(handleError);
};
