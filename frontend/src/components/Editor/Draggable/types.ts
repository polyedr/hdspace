import { ElementType } from '../../../constants/dragAndDrop';
import { StateElement } from '../../../redux/project/types';

export type SyntheticElement<T> = {
  original: T;
  parent?: StateElement;
  type: ElementType;
};
