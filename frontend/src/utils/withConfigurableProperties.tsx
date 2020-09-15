import React, { useCallback } from 'react';
import { connect, useSelector } from 'react-redux';
import {
  selectActiveElement,
  selectCurrentScreenId,
  selectEditableStyles,
} from '../redux/project/selectors';
import { Entity } from '../domain/core';
import { AppReduxState } from '../shared/types/app';
import {
  removeElementStyles,
  removeSharedStyles,
  updateElementParameters,
  updateElementStyles,
  updateSharedStyles,
} from '../redux/project/actions';
import { LibraryElement } from '../api/types';
import { CssLikeStyles } from './StyleHelper';

type StateProps = {
  activeItemType: Entity | 'none';
  activeItemID: string;
  editableStyles: string;
};

function mapState(state: AppReduxState): StateProps {
  const activeItemType = selectActiveElement(state).type;
  const activeItemID = selectActiveElement(state).id;
  const editableStyles = selectEditableStyles(state);

  return {
    activeItemType,
    activeItemID,
    editableStyles,
  };
}

const mapDispatch = {
  updateElementParameters,
  removeSharedStyles,
  updateSharedStyles,
  removeElementStyles,
  updateElementStyles,
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
        removeElementStyles(itemID || activeItemID, ruleName, {
          screenId: currentScreenId,
        });
      } else {
        removeSharedStyles(editableStyles, ruleName, {
          screenId: currentScreenId,
        });
      }
    };

    const updateStyles = (styles: CssLikeStyles, itemID?: string) => {
      if (editableStyles === 'ownStyles') {
        updateElementStyles(itemID || activeItemID, styles, {
          screenId: currentScreenId,
        });
      } else {
        updateSharedStyles(editableStyles, styles, {
          screenId: currentScreenId,
        });
      }
    };

    const updateParams = useCallback(
      (params: Params<K>, itemID?: string) => {
        updateElementParameters(itemID || activeItemID, params, {
          screenId: currentScreenId,
        });
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
