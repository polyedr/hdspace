import { IScenarioItem } from '$redux/project/reducer';
import { myAxios } from '$config/settings';
import { onError, parseResult } from './project';


export const apiGetScenarios = (props): Promise<IScenarioItem[]> => (
  myAxios({
    ...props,
    method: 'GET',
    url: '/projects/screen-scenarios/',
  })
    .then(parseResult)
    .catch(onError)
);

export const apiAddScenario = (props): Promise<IScenarioItem> => (
  myAxios({
    ...props,
    method: 'POST',
    url: '/projects/screen-scenarios/',
  })
    .then(parseResult)
    .catch(onError)
);

export const apiAddScenarios = (props): Promise<IScenarioItem[]> => (
  myAxios({
    ...props,
    method: 'POST',
    url: '/projects/screen-scenarios-multiple/',
  })
    .then(parseResult)
    .catch(onError)
);

// export const apiDelScenario = id => (
//   client.delete(`/projects/screen-scenarios/${id}`)
//     .then(parseResult)
//     .catch(onError)
// );

export const apiDelScenarioCascade = props => (
  myAxios({
    ...props,
    method: 'DELETE',
    url: `/projects/screen-scenarios-delete-cascade/?ids=${props.list}`,
  })
    .then(parseResult)
    .catch(onError)
);

export const apiSaveScenario = (props): Promise<IScenarioItem> => (
  myAxios({
    ...props,
    method: 'PATCH',
    url: `/projects/screen-scenarios/${props.data.id}/`,
  })
    .then(parseResult)
    .catch(onError)
);

export const apiSaveScenarios = (props): Promise<IScenarioItem[]> => (
  myAxios({
    ...props,
    method: 'PATCH',
    url: '/projects/screen-scenarios-multiple/',
  })
    .then(parseResult)
    .catch(onError)
);

export const apiSetScenarioNeuralNetwork = (props): Promise<IScenarioItem[]> => (
  myAxios({
    ...props,
    method: 'PATCH',
    url: '/virtualize/virtualize-elements/',
  })
    .then(parseResult)
    .catch(onError)
);
