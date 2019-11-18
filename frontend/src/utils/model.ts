import {
  IScenarioItem,
} from '$redux/project/reducer';

export const greaterBuoyancyFirst = (a: IScenarioItem, b: IScenarioItem) => b.buoyancy - a.buoyancy;
export const isElement = (id: string) => id.slice(-1) === 'e';
