import {
  IListSortable,
  ILSItem,
  IScenarioElements,
  IScenarios,
} from '$redux/project/types';
import { scenarioItemToLS, elementToLS } from '$utils/parseScenario';

export const completeLS = (
  scenarios: IScenarios,
  scenariosElements: IScenarioElements,
  root: ILSItem,
): IListSortable => {
  const childrenToLS = (rawChildrenIDs: string[]): IListSortable => rawChildrenIDs.reduce((acc: IListSortable, rawChildID) => {
    const isScenario = rawChildID.slice(-1) === 's';
    const childID = parseInt(rawChildID);
    if (isScenario) {
      const scenario = scenarios[childID];
      return { ...acc, [rawChildID]: scenarioItemToLS(scenario), ...childrenToLS(scenario.parameters.children) };
    }
    const element = scenariosElements[childID];
    return { ...acc, [rawChildID]: elementToLS(element) };
  }, { root });

  const listSortable = childrenToLS(root.children);
  return listSortable;
};
