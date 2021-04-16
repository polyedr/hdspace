import { StateElement } from '@Src/types';
import React from 'react';

export type RendererProps = React.PropsWithChildren<{
  element: StateElement;
  isDisabled: boolean;
}>;
