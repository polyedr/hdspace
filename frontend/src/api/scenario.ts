import { myAxios } from '../config/settings';
import { ScenarioItem, MyAxiosProps, Result } from '../types';
import { handleError, onError, parseResult } from './helper';

export const apiGetScenarios = async ({
  screenID,
  ...props
}: MyAxiosProps & { screenID: string }): Promise<ScenarioItem[]> =>
  await myAxios({
    ...props,
    method: 'GET',
    url: `/projects/screen-scenarios${
      screenID ? `/?screenId=${screenID}` : '/'
    }`,
  })
    .then(parseResult)
    .catch(onError);

export const apiCreateScenarios = async (
  props: MyAxiosProps,
): Promise<Result<ScenarioItem[]>> =>
  await myAxios({
    ...props,
    method: 'POST',
    url: '/projects/screen-scenarios-multiple/',
  })
    .then((res) => ({
      result: parseResult(res),
    }))
    .catch(handleError);

export const apiUpdateScenarios = async (
  props: MyAxiosProps,
): Promise<Result<ScenarioItem[]>> =>
  await myAxios({
    ...props,
    method: 'PATCH',
    url: '/projects/screen-scenarios-multiple/',
  })
    .then((res) => ({ result: parseResult(res) }))
    .catch(handleError);
