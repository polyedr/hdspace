import { AxiosResponse } from 'axios';
import { AssetsList, PaginatedArray } from '@Src/types';
import { ServerAsset } from '../asset/fromResponse';

export interface ServerAssetList {
  id: string;
  name: string;
  illustrationList?: string | null;
  images: ServerAsset[];
  created: string;
  modified: string;
  project: string;
}

export const convertFromServerAssetList = (list: ServerAssetList) => {
  const { id, name, created, modified, project } = list;

  return {
    id,
    name,
    created: new Date(created),
    modified: new Date(modified),
    projectId: project,
  } as AssetsList;
};

export const convertResponseToAssetList = (
  response: AxiosResponse<ServerAssetList>,
) => convertFromServerAssetList(response.data);

export const convertResponseToPaginatedAssetLists = (
  response: AxiosResponse<PaginatedArray<ServerAssetList>>,
) => {
  const { next, previous, results, pageSize } = response.data;
  return {
    next,
    previous,
    pageSize,
    results: results.map(convertFromServerAssetList),
    loading: false,
  };
};
