import { StateElement } from '../../../redux/project/types';

export enum ElementType {
  ELEMENT = 'element',
  CONSTRUCTOR = 'constructor',
}

export type SyntheticElement<T> = {
  original: T;
  parent?: StateElement;
  type: ElementType;
};
