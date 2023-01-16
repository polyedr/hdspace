import {
  Entity,
  FlexConstraints,
  LibraryElement,
  PropertiesChangeProps,
} from '@Src/types';

export enum MarginType {
  TOP = 'marginTop',
  LEFT = 'marginLeft',
  RIGHT = 'marginRight',
  BOTTOM = 'marginBottom',
}

export enum PaddingType {
  TOP = 'paddingTop',
  LEFT = 'paddingLeft',
  RIGHT = 'paddingRight',
  BOTTOM = 'paddingBottom',
}

export enum FlexSpacing {
  BETWEEEN = 'space-between',
  AROUND = 'space-around',
}

export enum FlexWrap {
  WRAP = 'wrap',
  NOWRAP = 'nowrap',
}

export enum FlexDirection {
  COLUMN = 'column',
  ROW = 'row',
}

export type Props = PropertiesChangeProps<LibraryElement<Entity>> &
  FlexConstraints;
