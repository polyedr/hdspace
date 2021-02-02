import { Asset, PaginatedArray } from '@Src/types';
import { AxiosResponse } from 'axios';

export type ServerAsset = {
  id: string;
  image: string | null;
  created: string;
  modified: string;
  // eslint-disable-next-line camelcase
  illustration_set: string | null;
};

export const convertFromServerAsset = (serverAsset: ServerAsset): Asset => {
  // eslint-disable-next-line camelcase
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
