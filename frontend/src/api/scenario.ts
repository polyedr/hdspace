import { IScenarioItem } from '$redux/project/types';
import { myAxios, MyAxiosProps } from '$config/settings';
import { onError, parseResult } from './project';

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

export const apiAddScenario = (props: MyAxiosProps): Promise<IScenarioItem> =>
  myAxios({
    ...props,
    method: 'POST',
    url: '/projects/screen-scenarios/',
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

// export const apiDelScenario = id => (
//   client.delete(`/projects/screen-scenarios/${id}`)
//     .then(parseResult)
//     .catch(onError)
// );

export const apiDelScenarioCascade = (
  props: MyAxiosProps & { list: string[] },
) =>
  myAxios({
    ...props,
    method: 'DELETE',
    url: `/projects/screen-scenarios-delete-cascade/?ids=${props.list}`,
  })
    .then(parseResult)
    .catch(onError);

export const apiSaveScenario = (props: MyAxiosProps): Promise<IScenarioItem> =>
  myAxios({
    ...props,
    method: 'PATCH',
    url: `/projects/screen-scenarios/${props.data.id}/`,
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

export const apiSetScenarioNeuralNetwork = (
  props: MyAxiosProps,
): Promise<IScenarioItem[]> =>
  myAxios({
    ...props,
    method: 'PATCH',
    url: '/virtualize/virtualize-elements/',
  })
    .then(parseResult)
    .catch(onError);
