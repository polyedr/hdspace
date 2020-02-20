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
  updateElementImage: actionsCreators.updateElementImage,
  updateElementParameters: actionsCreators.updateElementParameters,
  updateElementStyles: actionsCreators.updateElementStyles,
  updateScenarioStyles: actionsCreators.updateScenarioStyles,
};

export type PropertiesChangeProps = {
  activeItemID: string;
  updateStyles(payload: CssLikeStyles): void;
  updateParams(payload: Params): void;
  updateImage(image: File): void;
};

type Params = Partial<{ [P in keyof ProjectT.IScreenProps]: ProjectT.IScreenProps[P] }>;

// potentially pass config with needed styles/params first
export function withConfigurableProperties<T extends PropertiesChangeProps>(
  Component: React.ComponentType<T>
): React.FC<Omit<T, keyof PropertiesChangeProps>> {
  function WrapperComponent(props: any) {
    const { activeItemID, updateScenarioStyles, updateElementStyles, updateElementParameters, updateElementImage, ...restProps } = props;

    const updateStyles = useCallback((styles: CssLikeStyles) => {
      if (activeItemID.slice(-1) === 's') {
        updateScenarioStyles(activeItemID, styles);
      } else {
        updateElementStyles(activeItemID, styles);
      }
    }, [activeItemID]);

    const updateParams = useCallback((params: Params) => {
      updateElementParameters(activeItemID, params);
    }, [activeItemID]);

    const updateImage = useCallback((image) => {
      updateElementImage(activeItemID, image);
    }, [activeItemID])

    return (
      <Component
        {...restProps}
        activeItemID={activeItemID}
        updateStyles={updateStyles}
        updateParams={updateParams}
        updateImage={updateImage}
      />
    );
  }

  // potentially need to makeMapState and makeMapDispatch for each WrapperComponent
  return connect(mapState, mapDispatch)(WrapperComponent);
}
