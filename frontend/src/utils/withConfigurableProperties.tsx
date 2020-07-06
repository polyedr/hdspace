import React, { useCallback } from 'react';
import { connect } from 'react-redux';

import { AppReduxState } from '$shared/types/app';
import { IScenarioElement } from '$redux/project/types';
import { actionsCreators, selectors } from '$redux/project/';
import { T as ProjectT } from '$redux/project';
import { CssLikeStyles } from '$utils/StyleHelper';

type StateProps = {
  activeItemID: string;
  activeItemStyles: CssLikeStyles;
  activeItemChildrenStyles: Record<string, CssLikeStyles>;
  scenarioElement: IScenarioElement;
};

function mapState(state: AppReduxState): StateProps {
  const activeItemID = selectors.selectActiveItem(state).itemId;
  const scenarioElement = selectors.selectScenarioElement(state, parseInt(activeItemID));
  const activeItemStyles = selectors.selectActiveItemStyles(state) as Required<CssLikeStyles>;
  const activeItemChildrenStyles = selectors.selectActiveItemChildrenStyles(state) as Record<string, CssLikeStyles>;

  return {
    activeItemID,
    scenarioElement,
    activeItemStyles,
    activeItemChildrenStyles,
  };
}

const mapDispatch = {
  updateElementParameters: actionsCreators.updateElementParameters,
  updateElementStyles: actionsCreators.updateElementStyles,
};

export type PropertiesChangeProps = {
  activeItemID: string;
  updateStyles(payload: CssLikeStyles): void;
  updateParams(payload: Params, updatedItemID?: number): void;
};

type Params = Partial<{ [P in keyof ProjectT.IScreenProps]: ProjectT.IScreenProps[P] }>;

// potentially pass config with needed styles/params first
export function withConfigurableProperties<T extends PropertiesChangeProps>(
  Component: React.ComponentType<T>
): React.FC<Omit<T, keyof PropertiesChangeProps>> {
  function WrapperComponent(props: any) {
    const {
      activeItemID,
      activeItemStyles,
      activeItemChildrenStyles,
      scenarioElement,
      updateElementStyles,
      updateElementParameters,
      ...restProps
    } = props;

    const updateStyles = useCallback((styles: CssLikeStyles) => {
      updateElementStyles(activeItemID, styles);
    }, [activeItemID]);

    const updateParams = useCallback((params: Params) => {
      updateElementParameters(activeItemID, params);
    }, [activeItemID]);

    return (
      <Component
        {...restProps}
        activeItemID={activeItemID}
        activeItemStyles={activeItemStyles}
        updateStyles={updateStyles}
        updateParams={updateParams}
      />
    );
  }

  // potentially need to makeMapState and makeMapDispatch for each WrapperComponent
  return connect(mapState, mapDispatch)(WrapperComponent);
}
