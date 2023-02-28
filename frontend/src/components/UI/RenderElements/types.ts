import { ReactElement } from 'react';
import { StateElement } from '@Src/types';

export interface RendererProps {
  style?: string[];
  element: StateElement;
  isDisabled?: boolean;
  children?: ReactElement[];
}

export type EventHandlers<T extends HTMLElement> = Record<
  string,
  (event: React.SyntheticEvent<T>) => void
>;
