import { onError, parseResult } from './project';
import { IScenarioItem } from '../redux/project/types';
import { myAxios, MyAxiosProps } from '../config/settings';

export const apiGetScenarios = ({
  screenID,
  ...props
}: MyAxiosProps & { screenID: string }): Promise<IScenarioItem[]> =>
  myAxios({
    ...props,
    method: 'GET',
    url: `/projects/screen-scenarios${
      screenID ? `/?screenId=${screenID}` : '/'
    }`,
  })
    .then(parseResult)
    .catch(onError);

export const apiAddScenarios = (
  props: MyAxiosProps,
): Promise<IScenarioItem[]> =>
  myAxios({
    ...props,
    method: 'POST',
    url: '/projects/screen-scenarios-multiple/',
  })
    .then(parseResult)
    .catch(onError);

export const apiSaveScenarios = (
  props: MyAxiosProps,
): Promise<IScenarioItem[]> =>
  myAxios({
    ...props,
    method: 'PATCH',
    url: '/projects/screen-scenarios-multiple/',
  })
    .then(parseResult)
    .catch(onError);
