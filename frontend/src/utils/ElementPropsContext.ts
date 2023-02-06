import React from 'react';
import { NOT_SELECTED_FRAMEWORK } from '@Constants/frameworks';
import { ElementProps } from '@Src/types';

export const PropsContext = React.createContext<ElementProps>({
  uiFramework: NOT_SELECTED_FRAMEWORK,
});

export const PropsProvider = PropsContext.Provider;

export const PropsConsumer = PropsContext.Consumer;
