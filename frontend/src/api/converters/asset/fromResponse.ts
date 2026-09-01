import { AxiosResponse } from 'axios';
import { Asset, PaginatedArray, ParsedImagePalette } from '@Src/types';

export interface ServerAsset {
  id: string;
  image: string | null;
  created: string;
  modified: string;
  illustration_set: string | null;
}

export interface ServerImagePalette {
  id: number;
  image: string;
  image_url: string;
  created: string;
  modified: string;
  illustration_set: number | null;
  fileurl: string | null;
  palette: string;
}

export const convertFromServerAsset = (serverAsset: ServerAsset): Asset => {
  const { id, image, created, modified, illustration_set } = serverAsset;
  return {
    id,
    image,
    created: new Date(created),
    modified: new Date(modified),
    listId: illustration_set,
  } as Asset;
};

export const convertResponseToAsset = (
  response: AxiosResponse<ServerAsset>,
): Asset => convertFromServerAsset(response.data);

export const convertResponseToImagePalette = (
  response: AxiosResponse<ServerImagePalette>,
): ParsedImagePalette => JSON.parse(response.data.palette);

export const convertResponseToPaginatedAssets = (
  response: AxiosResponse<PaginatedArray<ServerAsset>>,
): PaginatedArray<Asset> => {
  const { next, previous, results, pageSize } = response.data;
  return {
    next,
    previous,
    pageSize,
    results: results.map(convertFromServerAsset),
    loading: false,
  };
};

export const convertToServerAsset = (
  asset: Partial<Asset>,
): Partial<ServerAsset> =>
  Object.keys(asset).reduce((serverAsset, assetField) => {
    const serverAssetField =
      assetField === 'listId' ? 'illustration_set' : assetField;
    return {
      ...serverAsset,
      [serverAssetField]: asset[assetField],
    };
  }, {});
