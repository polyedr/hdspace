import React, { useCallback } from 'react';
import { connect } from 'react-redux';

import { AppReduxState } from '$shared/types/app';
import { IScenarioElement } from '$redux/project/types';
import { actionsCreators, selectors } from '$redux/project/';
import { CssLikeStyles } from '$utils/StyleHelper';
import { LibraryElement } from '$api/types';
import { Entity } from '$domain/core';

type StateProps = {
  activeItemType: Entity | 'none';
  activeItemID: string;
  editableStyles: string;
  activeItemStyles: CssLikeStyles;
  activeItemChildrenStyles: Record<string, CssLikeStyles>;
  scenarioElement: IScenarioElement;
};

function mapState(state: AppReduxState): StateProps {
  const activeItemType = selectors.selectActiveItem(state).itemType;
  const activeItemID = selectors.selectActiveItem(state).itemId;
  const editableStyles = selectors.selectEditableStyles(state);
  const scenarioElement = selectors.selectScenarioElement(state, parseInt(activeItemID));
  const activeElementStyles = selectors.selectActiveItemStyles(state).idStyles;
  const activeTagStyles = selectors.selectCurrentProject(state).projectData.classes.find(cssClass => cssClass.name === activeItemType);

  const activeItemStyles = editableStyles === 'idStyles' || editableStyles === '' ? activeElementStyles : activeTagStyles?.rules || {};


  console.log(editableStyles === 'tagStyles', activeItemStyles)


  const activeItemChildrenStyles = selectors.selectActiveItemChildrenStyles(state) as Record<string, CssLikeStyles>;

  return {
    activeItemType,
    activeItemID,
    editableStyles,
    scenarioElement,
    activeItemStyles,
    activeItemChildrenStyles,
  };
}

const mapDispatch = {
  updateElementParameters: actionsCreators.updateElementParameters,
  updateSharedStyles: actionsCreators.updateSharedStyles,
  updateElementStyles: actionsCreators.updateElementStyles,
};

export type PropertiesChangeProps<T extends LibraryElement<Entity>> = {
  activeItemID: string;
  updateStyles(payload: CssLikeStyles): void;
  updateParams(payload: Params<T>, updatedItemID?: string): void;
};

type Params<T extends LibraryElement<Entity>> = Partial<T['parameters']>;

// potentially pass config with needed styles/params first
export function withConfigurableProperties<K extends LibraryElement<Entity>, T extends PropertiesChangeProps<K>>(
  Component: React.ComponentType<T>
): React.FC<Omit<T, keyof PropertiesChangeProps<K>>> {
  function WrapperComponent(props: any) {
    const {
      activeItemType,
      activeItemID,
      editableStyles,
      activeItemStyles,
      activeItemChildrenStyles,
      scenarioElement,
      updateSharedStyles,
      updateElementStyles,
      updateElementParameters,
      ...restProps
    } = props;

    const updateStyles = useCallback((styles: CssLikeStyles, itemID?: string) => {
      if (editableStyles === 'idStyles') {
        console.log('updateElementStyles');
        updateElementStyles(itemID || activeItemID, styles);
      } else {
        console.log('updateSharedStyles');
        updateSharedStyles(editableStyles, styles);
      }
    }, [activeItemID, editableStyles]);

    const updateParams = useCallback((params: Params<K>, itemID?: string) => {
      updateElementParameters(itemID || activeItemID, params);
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
