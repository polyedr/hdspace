import React, { useCallback } from 'react';
import { connect, useSelector } from 'react-redux';

import { AppReduxState } from '$shared/types/app';
import { actionsCreators, selectors } from '$redux/project/';
import { CssLikeStyles } from '$utils/StyleHelper';
import { LibraryElement } from '$api/types';
import { Entity } from '$domain/core';
import { selectCurrentScreenId } from '$redux/project/selectors';

type StateProps = {
  activeItemType: Entity | 'none';
  activeItemID: string;
  editableStyles: string;
};

function mapState(state: AppReduxState): StateProps {
  const activeItemType = selectors.selectActiveItem(state).itemType;
  const activeItemID = selectors.selectActiveItem(state).itemId;
  const editableStyles = selectors.selectEditableStyles(state);

  return {
    activeItemType,
    activeItemID,
    editableStyles,
  };
}

const mapDispatch = {
  updateElementParameters: actionsCreators.updateElementParameters,
  removeSharedStyles: actionsCreators.removeSharedStyles,
  updateSharedStyles: actionsCreators.updateSharedStyles,
  removeElementStyles: actionsCreators.removeElementStyles,
  updateElementStyles: actionsCreators.updateElementStyles,
};

export type PropertiesChangeProps<T extends LibraryElement<Entity>> = {
  activeItemID: string;
  removeStyles(cssPropertiesNames: string[]): void;
  updateStyles(payload: CssLikeStyles): void;
  updateParams(payload: Params<T>, updatedItemID?: string): void;
};

type Params<T extends LibraryElement<Entity>> = Partial<T['parameters']>;

// potentially pass config with needed styles/params first
export function withConfigurableProperties<
  K extends LibraryElement<Entity>,
  T extends PropertiesChangeProps<K>
>(
  Component: React.ComponentType<T>,
): React.FC<Omit<T, keyof PropertiesChangeProps<K>>> {
  function WrapperComponent({
    activeItemType,
    activeItemID,
    editableStyles,
    removeSharedStyles,
    updateSharedStyles,
    removeElementStyles,
    updateElementStyles,
    updateElementParameters,
    ...restProps
  }: any) {
    const currentScreenId = useSelector(selectCurrentScreenId);

    const removeStyles = (ruleName: string, itemID?: string) => {
      if (editableStyles === 'ownStyles') {
        removeElementStyles(itemID || activeItemID, ruleName, currentScreenId);
      } else {
        removeSharedStyles(editableStyles, ruleName);
      }
    };

    const updateStyles = (styles: CssLikeStyles, itemID?: string) => {
      if (editableStyles === 'ownStyles') {
        updateElementStyles(itemID || activeItemID, styles, currentScreenId);
      } else {
        updateSharedStyles(editableStyles, styles);
      }
    };

    const updateParams = useCallback(
      (params: Params<K>, itemID?: string) => {
        updateElementParameters(
          itemID || activeItemID,
          params,
          currentScreenId,
        );
      },
      [activeItemID, currentScreenId],
    );

    return (
      <Component
        {...restProps}
        activeItemID={activeItemID}
        removeStyles={removeStyles}
        updateStyles={updateStyles}
        updateParams={updateParams}
      />
    );
  }

  // potentially need to makeMapState and makeMapDispatch for each WrapperComponent
  return connect(mapState, mapDispatch)(WrapperComponent);
}
