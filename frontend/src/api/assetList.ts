import { myAxios } from '@Src/config/settings';
import { MyAxiosProps } from '@Src/types';
import {
  convertResponseToPaginatedAssetLists,
  convertResponseToAssetList,
} from './converters/assetList/fromResponse';
import { handleError } from './project';

export const apiGetAssetLists = (props: MyAxiosProps = {}) => {
  return myAxios({
    ...props,
    method: 'GET',
    url: `/projects/illustrations/`,
  })
    .then(convertResponseToPaginatedAssetLists)
    .catch(handleError);
};

export const apiCreateAssetList = (
  props: MyAxiosProps & { projectId: string; name: string },
) => {
  const { projectId, name, ...axiosProps } = props;
  myAxios({
    ...axiosProps,
    method: 'POST',
    url: `projects/illustrations/`,
    params: {
      ...(props.params || {}),
      projectId,
      name,
    },
  })
    .then(convertResponseToAssetList)
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
    .then(() => {})
    .catch(handleError);
};
