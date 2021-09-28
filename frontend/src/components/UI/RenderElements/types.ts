import { ReactElement } from 'react';
import { StateElement } from '@Src/types/types';

export type RendererProps = {
  style?: Array<string>;
  element: StateElement;
  isDisabled?: boolean;
  children?: ReactElement[];
};

export type EventHandlers<T extends HTMLElement> = {
  [eventName: string]: (event: React.SyntheticEvent<T>) => void;
};
