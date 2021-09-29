import { myAxios } from '../config/settings';
import { ScenarioItem, MyAxiosProps, Result } from '../types/types';
import { handleError, onError, parseResult } from './helper';

export const apiGetScenarios = ({
  screenID,
  ...props
}: MyAxiosProps & { screenID: string }): Promise<ScenarioItem[]> =>
  myAxios({
    ...props,
    method: 'GET',
    url: `/projects/screen-scenarios${
      screenID ? `/?screenId=${screenID}` : '/'
    }`,
  })
    .then(parseResult)
    .catch(onError);

export const apiCreateScenarios = (
  props: MyAxiosProps,
): Promise<Result<ScenarioItem[]>> =>
  myAxios({
    ...props,
    method: 'POST',
    url: '/projects/screen-scenarios-multiple/',
  })
    .then((res) => ({
      result: parseResult(res),
    }))
    .catch(handleError);

export const apiUpdateScenarios = (
  props: MyAxiosProps,
): Promise<Result<ScenarioItem[]>> =>
  myAxios({
    ...props,
    method: 'PATCH',
    url: '/projects/screen-scenarios-multiple/',
  })
    .then((res) => ({ result: parseResult(res) }))
    .catch(handleError);
