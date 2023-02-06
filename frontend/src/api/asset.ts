import { AxiosResponse } from 'axios';
import { myAxios } from '@Src/config/settings';
import {
  Asset,
  MyAxiosProps,
  PaginatedArray,
  ParsedImagePalette,
  Result,
} from '@Src/types';
import {
  convertResponseToAsset,
  convertResponseToImagePalette,
  convertResponseToPaginatedAssets,
  convertToServerAsset,
  ServerAsset,
  ServerImagePalette,
} from './converters/asset/fromResponse';
import { handleError } from './helper';

export const apiGetAsset = async (props: MyAxiosProps & { id: string }) => {
  const { id, ...axiosProps } = props;
  return await myAxios({
    ...axiosProps,
    method: 'GET',
    url: `/projects/images/${id}`,
  }).then((res) => convertResponseToAsset(res));
};

export const apiCreateAsset = async (
  props: MyAxiosProps & { assetFormData: FormData },
): Promise<Result<Asset>> => {
  const { assetFormData, ...axiosProps } = props;
  return await myAxios({
    ...axiosProps,
    url: '/projects/images/',
    method: 'POST',
    contentType: 'multipart/form-data',
    data: assetFormData,
  })
    .then((response: AxiosResponse<ServerAsset>) => ({
      result: convertResponseToAsset(response),
    }))
    .catch(handleError);
};

export const apiDeleteAsset = async (
  props: MyAxiosProps & {
    id: string;
  },
) => {
  const { id, ...axiosProps } = props;
  return await myAxios({
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

export const apiUpdateAsset = async (
  props: MyAxiosProps & {
    id: string;
    asset: Partial<Asset>;
  },
) => {
  const { id, asset, ...axiosProps } = props;
  return await myAxios({
    ...axiosProps,
    url: `/projects/images/${id}/`,
    method: 'PATCH',
    data: convertToServerAsset(asset),
  });
};

export const apiGetAssets = async (
  props: MyAxiosProps & { assetListId?: string; next: string },
) => {
  const { assetListId, next, ...axiosProps } = props;
  return await myAxios({
    ...axiosProps,
    url: next || '/projects/images/',
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

export const apiGenerateImagePalette = async (
  props: MyAxiosProps & { imageUrl: string },
): Promise<ParsedImagePalette | { error: any }> => {
  const { imageUrl, ...axiosProps } = props;
  return await myAxios({
    ...axiosProps,
    url: '/projects/images_palette/',
    method: 'POST',
    data: { fileurl: imageUrl },
  })
    .then((response: AxiosResponse<ServerImagePalette>) =>
      convertResponseToImagePalette(response),
    )
    .catch(handleError);
};
