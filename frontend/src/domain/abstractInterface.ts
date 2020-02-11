import * as R from 'ramda';
import { IScenarioItem } from '$redux/project/types';

type CollectChildrenAcc = { scenariosIDs: string[], elementsIDs: string[] };

export const collectChildren = (screenScenarios: IScenarioItem[], children: string[]) => children
  .reduce((acc: CollectChildrenAcc, x): CollectChildrenAcc => {
    const isScenario = x.slice(-1) === 's';
    const scenario = isScenario ? screenScenarios.find(s => s.id === parseInt(x)) : null;
    const { elementsIDs, scenariosIDs } = scenario
      ? collectChildren(screenScenarios, scenario.parameters.children)
      : { elementsIDs: [], scenariosIDs: [] };
    return { elementsIDs: acc.elementsIDs.concat(elementsIDs), scenariosIDs: acc.scenariosIDs.concat(scenariosIDs)};
  },
  { scenariosIDs: children.filter(x => x.slice(-1) === 's'), elementsIDs: children.filter(x => x.slice(-1) !== 's')}
);

export const makeContainerLens = (scenarioID?: R.Path[0]) => {
  const specifiedEntity = scenarioID ? [scenarioID.toString()] : [];
  return {
    children: R.lensPath(specifiedEntity.concat(['parameters', 'children'])),
    parent: R.lensPath(specifiedEntity.concat(['parent_id'])),
    elements: R.lensPath(specifiedEntity.concat(['elements'])),
    id: R.lensPath(specifiedEntity.concat(['id'])),
  };
};

export const makeElementLens = (elementID?: R.Path[0]) => {
  const specifiedEntity = elementID ? [elementID.toString()] : [];
  return {
    parent: R.lensPath(specifiedEntity.concat(['parameters', 'parent_id'])),
    scenario: R.lensPath(specifiedEntity.concat(['scenario'])),
    id: R.lensPath(specifiedEntity.concat(['id'])),
  };
};
