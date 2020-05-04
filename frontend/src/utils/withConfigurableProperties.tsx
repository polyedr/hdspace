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
  updateChildStyles: actionsCreators.updateChildStyles,
  updateScenarioStyles: actionsCreators.updateScenarioStyles,
};

export type PropertiesChangeProps = {
  activeItemID: string;
  updateStyles(payload: CssLikeStyles): void;
  updateParams(payload: Params, id?: number): void;
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
      updateScenarioStyles,
      updateElementStyles,
      updateChildStyles,
      updateElementParameters,
      childName,
      ...restProps
    } = props;

    const updateStyles = useCallback((styles: CssLikeStyles) => {
      if (activeItemID.slice(-1) === 's') {
        updateScenarioStyles(activeItemID, styles);
      } else {
        const currentChild = childName && (scenarioElement as IScenarioElement).children.find(child => child.struct_type === childName)?.id;
        const updatedID = childName && currentChild ? `${currentChild}e` : activeItemID;

        if (childName) {
          updateChildStyles(activeItemID, updatedID, styles);
        } else {
          updateElementStyles(updatedID, styles);
        }
      }
    }, [activeItemID]);

    const updateParams = useCallback((params: Params, id?: number) => {
      updateElementParameters(id && `${id}e` || activeItemID, params);
    }, [activeItemID]);

    return (
      <Component
        {...restProps}
        activeItemID={activeItemID}
        activeItemStyles={childName ? activeItemChildrenStyles[childName].styles : activeItemStyles}
        updateStyles={updateStyles}
        updateParams={updateParams}
      />
    );
  }

  // potentially need to makeMapState and makeMapDispatch for each WrapperComponent
  return connect(mapState, mapDispatch)(WrapperComponent);
}
