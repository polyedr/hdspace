import { ReactElement } from 'react';
import { StateElement } from '@Src/types';

export type RendererProps = {
  element: StateElement;
  isDisabled?: boolean;
  children?: ReactElement[];
  pseudoClass: string | null;
};

export type DefaultEventHandlers = {
  [eventName: string]: (event: React.SyntheticEvent<HTMLElement>) => void;
};
