import React, { useCallback } from 'react';
import { connect } from 'react-redux';

import { AppReduxState } from '$shared/types/app';
import { actionsCreators, selectors } from '$redux/project/';
import { T as ProjectT } from '$redux/project';
import { CssLikeStyles } from '$utils/StyleHelper';

type StateProps = {
  activeItemID: string;
};

function mapState(state: AppReduxState): StateProps {
  return {
    activeItemID: selectors.selectActiveItem(state).itemId,
  };
}

const mapDispatch = {
  updateElementParameters: actionsCreators.updateElementParameters,
  updateElementStyles: actionsCreators.updateElementStyles,
  updateScenarioStyles: actionsCreators.updateScenarioStyles,
};

export type PropertiesChangeProps = {
  activeItemID: string;
  updateStyles(payload: CssLikeStyles): void;
  updateParams(payload: { [P in keyof ProjectT.IScreenProps]: ProjectT.IScreenProps[P] }): void;
};

type Params = { [key: string]: string | number };

// potentially pass config with needed styles/params first
export function withConfigurableProperties<T extends PropertiesChangeProps>(
  Component: React.ComponentType<T>
): React.FC<Omit<T, keyof PropertiesChangeProps>> {
  function WrapperComponent(props: any) {
    const { activeItemID, updateScenarioStyles, updateElementStyles, updateElementParameters, ...restProps } = props;

    const updateStyles = useCallback((styles: CssLikeStyles) => {
      if (activeItemID.slice(-1) === 's') {
        updateScenarioStyles(activeItemID, styles);
      } else {
        updateElementStyles(activeItemID, styles);
      }
    }, [activeItemID]);

    const updateParams = useCallback((params: Params) => {
      updateElementParameters(params);
    }, [activeItemID]);

    return (
      <Component
        {...restProps}
        activeItemID={activeItemID}
        updateStyles={updateStyles}
        updateParams={updateParams}
      />
    );
  }

  // potentially need to makeMapState and makeMapDispatch for each WrapperComponent
  return connect(mapState, mapDispatch)(WrapperComponent);
}
