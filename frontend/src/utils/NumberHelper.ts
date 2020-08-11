import { IScenarioElement } from '$redux/project/types';

type TIsNumber = (value: string | number) => boolean;
type TStrToNumber = (value: string) => number;

export const isNumber: TIsNumber = (value) =>
  (value && !Number.isNaN(Number(value))) || false;

export const strToNumber: TStrToNumber = (value) =>
  (isNumber(value) && parseInt(value)) || 0;

export const getDecimals = (a: any) => {
  if (!Number.isFinite(a)) return 0;

  let e = 1;
  let p = 0;

  while (Math.round(a * e) / e !== a) {
    e *= 10;
    p += 1;
  }

  return p;
};

export const average = (a: number, b: number) => (a + b) * 0.5;

export const getPermissibleValue = (
  value: number,
  min: number,
  max: number,
): number => {
  if (value < min) return min;

  if (value > max) return max;

  return value;
};

// lol, here is always zero
export const getBuoyancy = (listEl: IScenarioElement[] = []): number =>
  listEl.reduce((a, b) => (a + b.dynamic_buoyancy || 0, 0) / listEl.length, 0);

export const getDaysInMonth = (month: number, year: number) =>
  new Date(year, month, 0).getDate();

export const getRandomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const safeParseInt = (
  value: string | undefined,
  radix?: number | undefined,
) => (value !== undefined ? parseInt(value, radix) : undefined);

export const safeParseFloat = (value: string | undefined) =>
  value !== undefined ? parseFloat(value) : undefined;

export const safeMatch = (value: string | undefined) => {
  if (value === undefined) return null;
  return value.match(/px|%/i);
};
