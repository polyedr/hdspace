import { IScenarioItem } from "$redux/project/types";
import {
  LIST_SCENARIO_TYPE,
} from '$constants/defaultParams';

export const greaterBuoyancyFirst = <T extends { buoyancy: number }>(a: T, b: T) => b.buoyancy - a.buoyancy;
export const isElement = (id: string) => id.slice(-1) === 'e';
export const isScenario = (x: any): x is IScenarioItem => LIST_SCENARIO_TYPE.indexOf(x.struct_type) !== -1;
