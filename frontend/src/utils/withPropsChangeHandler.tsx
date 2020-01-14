import React, { useCallback } from 'react';

import { actionsCreators } from '$redux/project/';
import { CssLikeStyles } from '$utils/StyleHelper';

type RequiredByWithPropsChangeHandlers = {
  updateScenarioStyles: typeof actionsCreators.updateScenarioStyles;
  updateElementStyles: typeof actionsCreators.updateElementStyles;
  activeItemID: string;
};

export type PropertiesChangeHandler = {
  updateStyles(payload: CssLikeStyles): void;
};

export function withPropsChangeHandler<T extends RequiredByWithPropsChangeHandlers & PropertiesChangeHandler>(
  Component: React.ComponentType<T>
): React.FC<Omit<T, keyof PropertiesChangeHandler>> {
  return function WrapperComponent(props: any) {
    const { activeItemID, updateScenarioStyles, updateElementStyles, ...restProps } = props;

    const updateStyles = useCallback((styles: CssLikeStyles) => {
      if (activeItemID.slice(-1) === 's') {
        updateScenarioStyles(activeItemID, styles);
      } else {
        updateElementStyles(activeItemID, styles);
      }
    }, [activeItemID]);

    return (
      <Component
        {...restProps}
        activeItemID={activeItemID}
        updateStyles={updateStyles}
      />
    );
  }
}
