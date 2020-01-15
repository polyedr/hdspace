import React, { useCallback } from 'react';

import { actionsCreators } from '$redux/project/';

type RequiredByWithParamsChangeHandlers = {
  updateElementParameters: typeof actionsCreators.updateElementParameters;
  activeItemID: string;
};

type Params = { [key: string]: string | number };

export type ParamsChangeHandler = {
  updateParams(payload: Params): void;
};

export function withParamsChangeHandler<T extends RequiredByWithParamsChangeHandlers & ParamsChangeHandler>(
  Component: React.ComponentType<T>
): React.FC<Omit<T, keyof ParamsChangeHandler>> {
  return function WrapperComponent(props: any) {
    const { activeItemID, updateElementParameters, ...restProps } = props;

    const updateParams = useCallback((params: Params) => {
      updateElementParameters(params);
    }, [activeItemID]);

    return (
      <Component
        {...restProps}
        activeItemID={activeItemID}
        updateParams={updateParams}
      />
    );
  }
}
