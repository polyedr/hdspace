import { myAxios } from '$config/settings';
import { onError, parseResult } from '$api/project';
import { IScenarioElement } from '$redux/project/reducer';

export const apiGetLibraryElements = () => (
  myAxios({
    method: 'GET',
    url: '/projects/library-elements/',
  })
    .then(parseResult)
    .catch(onError)
);

export const apiGetElements = (props): Promise<IScenarioElement[]> => (
  myAxios({
    ...props,
    method: 'GET',
    url: '/projects/scenario-elements/',
  })
    .then(parseResult)
    .catch(onError)
);

export const apiDelElements = props => (
  myAxios({
    ...props,
    method: 'DELETE',
    url: `/projects/scenario-elements-multi/?ids=${props.list}`,
  })
    .then(parseResult)
    .catch(onError)
);

export const apiSaveElements = (props): Promise<IScenarioElement[]> => (
  myAxios({
    ...props,
    method: 'PATCH',
    url: 'projects/scenario-elements-multi/',
  })
    .then(parseResult)
    .catch(onError)
);

export const apiDelElement = props => (
  myAxios({
    ...props,
    method: 'DELETE',
    url: `/projects/scenario-elements/${props.id}`,
  })
    .then(parseResult)
    .catch(onError)
);

export const apiAddElements = (props): Promise<IScenarioElement[]> => (
  myAxios({
    ...props,
    method: 'POST',
    url: '/projects/scenario-elements-multiple/',
  })
    .then(parseResult)
    .catch(onError)
);

export const uploadImageForNN = ({ screenID, ...props}) => (
  myAxios({
    ...props,
    method: 'PATCH',
    url: `/projects/project-screens/${screenID}/`,
  })
    .then(parseResult)
    .catch(onError)
);
