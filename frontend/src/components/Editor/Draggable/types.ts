import { StateElement } from '../../../redux/project/types';

export enum ElementType {
  ELEMENT = 'element',
  CONSTRUCTOR = 'constructor',
}

export type SyntheticElement = {
  original: StateElement;
  parent?: StateElement;
  type: ElementType;
};
