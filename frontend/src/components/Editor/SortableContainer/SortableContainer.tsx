import React, { useCallback, useState, useEffect } from 'react';
import * as R from 'ramda';
import { connect } from 'react-redux';

import { AppReduxState } from '$shared/types/app';
import { SortableGroup } from '$components/Editor/SortableGroup/SortableGroup';
import { RENDERERS } from '$components/UI/RenderElements';
import { SavedElementsValues } from '$redux/project/types';
import { selectors, actionsCreators } from '$redux/project';
import { LIST_SCENARIO_TYPE } from '$constants/defaultParams';
import { convertPropCSS } from '$utils/StyleHelper';
import { LIBRARY_ELEMENTS } from '$domain/libraryElements/libraryElements';
import { ElementEntity, Entity } from '$domain/core';
import { LibraryElementUnion, LibraryElement } from '$api/types';
import { SharedRendererProps } from '$components/UI/RenderElements/types';
import { findParentByChildID } from '$utils/ElementsTreeHelper';

const isElementStructType = (type: string): type is ElementEntity => {
  return type in LIBRARY_ELEMENTS;
};

const mapStateToProps = (state: AppReduxState) => {
  const currentScreen = selectors.selectCurrentScreen(state);
  const root = selectors.selectRootElement(state);
  const rootID = selectors.selectRootID(state);
  const { listSortable } = selectors.selectCurrentScreen(state);
  const scenarioElements = selectors.selectScenariosElements(state);
  const savedElements = selectors.selectSavedElementsValues(state);
  const disableInteractions = state.user.isPrototypeMode;

  return {
    root,
    rootID,
    listSortable,
    scenarioElements,
    disableInteractions,
    currentScreen,
    savedElements,
  };
};

const mapDispatchToProps = {
  updateElementStyles: actionsCreators.updateElementStyles,
  moveElement: actionsCreators.moveElement,
  updateSavedElementValues: actionsCreators.updateSavedElementValues,
};

export type OwnProps = {
  item: LibraryElementUnion,
  activeItemId: string,
  isMoving: boolean,
  listNotDragging: string[],
  isResizing: boolean;
  isResizable?: boolean;

  onActiveElementChange(parentId: number, child: LibraryElement<Entity>): void,
  setIsMoving: (value: boolean) => void,
  setIsResizing: (value: boolean) => void;
}

type Props = OwnProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const SortableComponent = (props: Props) => {
  const {
    root,
    rootID,
    currentScreen,
    item,
    activeItemId,
    isMoving,
    listNotDragging,
    disableInteractions,
    onActiveElementChange,
    moveElement,
    setIsMoving,
    isResizing,
    setIsResizing,
    isResizable,
    listSortable,
    scenarioElements,
    savedElements,
    updateSavedElementValues,
    ...restProps
  } = props;

  const [isDragging, setIsDragging] = useState<boolean>(false);

  useEffect(() => {
    const radioNames = Object.values(listSortable)
      .filter(item => item.type === 'radiobutton')
      .map(item => scenarioElements[item.id]?.parameters.name);

    R.uniq(radioNames).forEach(groupName => {
      if (!groupName) {
        return;
      };

      const groupRadios = Object.values(listSortable)
        .filter(item => item.type === 'radiobutton')
        .map(item => scenarioElements[item.id])
        .filter(item => item?.parameters.name === groupName);

      const firstRadio = R.head(groupRadios);

      if(!savedElements[groupName]?.savedValue) {
        updateSavedElementValues(groupName, firstRadio?.parameters.value || '');
      };
    })
  }, [savedElements, listSortable, scenarioElements, updateSavedElementValues]);

  const handleChooseToSort = (itemIndex: number) => {
    // TODO: called when item chosen for sorting. rewrite without onActiveElementChange use
    setIsDragging(true);
    const draggedItem = (item.children as LibraryElementUnion[]).find(child => child.buoyancy === itemIndex);
    const itemID = draggedItem?.id;

    if (itemID !== activeItemId && draggedItem && itemID) {
      onActiveElementChange(Number(itemID), draggedItem);
    }
  };

  const handleItemPositionChange = (index: number, list: string[], parentId: string) => {
    setIsDragging(false);
    moveElement(index, activeItemId, parentId === 'root' ? rootID : parentId);
  };

  const getGroupName = useCallback((itemType): string => (
    LIST_SCENARIO_TYPE.indexOf(itemType) !== -1 ? itemType : 'element'
  ), []);

  const getIsPutItem = useCallback((type: string): boolean => (
    listNotDragging.indexOf(type) === -1
  ), [listNotDragging]);

  const isRadioChecked = (value: string, checkedRadio: SavedElementsValues[string]) => value === checkedRadio?.savedValue;

  const isCheckboxChecked = (itemId: string) => Boolean(savedElements[itemId]?.savedValue);

  const getIsActive = !disableInteractions && item.id === activeItemId;

  const { id, type, styles, children, name } = item;

  if (!isElementStructType(type)) {
    return null;
  }

  const ElementRenderer = RENDERERS[type];
  const parsedStyles = convertPropCSS(styles);

  const isSecondLevelContainer = findParentByChildID(root, id)?.id === rootID;

  const isOuterContainer = isSecondLevelContainer && root.children[0].id === id;

  const commonRendererProps: Omit<SharedRendererProps, 'children'> = {
    ...(disableInteractions && { className: '' }),
    id: id === rootID ? 'root' : id,
    isDisabled: !disableInteractions,
    style: parsedStyles,
    active: !disableInteractions && id === activeItemId,
    sortableId: id,
    elementRef: null,
  };

  const getAdditionalProps = () => {
    switch (item.type) {
      case 'container': {
        return {
          name,
          isOuterContainer,
          isSecondLevelContainer,
        }
      };
      case 'textinput': {
        return {
          ...commonRendererProps,
          currentValue: String(savedElements[id]?.savedValue),
          onElementChange: updateSavedElementValues,
          params: item.parameters,
        }
      };

      case 'textarea': {
        return {
          currentValue: savedElements[id]?.savedValue,
          onElementChange: updateSavedElementValues,
          params: item.parameters,
        }
      };

      case 'checkbox': {
        return {
          currentValue: savedElements[id]?.savedValue,
          isCheckboxChecked: isCheckboxChecked(id),
          onElementChange: updateSavedElementValues,
          params: item.parameters,
        }
      };

      case 'radiobutton': {
        return {
          currentValue: savedElements[id]?.savedValue,
          isRadioChecked: isRadioChecked(
            item.parameters.value,
            savedElements[item.parameters.name],
          ),
          onElementChange: updateSavedElementValues,
          params: item.parameters,
        }
      };

      case 'select': {
        return {
          currentValue: savedElements[id]?.savedValue,
          onElementChange: updateSavedElementValues,
          childrenElements: children,
          params: item.parameters,
        }
      };

      default: return {
        params: item.parameters,
      };
    }
  };

  return currentScreen &&
    currentScreen.screenLoader ? null : disableInteractions ? (
    <ElementRenderer
      key={id}
      {...commonRendererProps}
      {...getAdditionalProps()}
      {...restProps}
    >
      {(item.children as LibraryElementUnion[])?.map((child) => (
        <SortableContainer
          key={child.id}
          activeItemId={activeItemId}
          isMoving={isMoving}
          item={child}
          listNotDragging={listNotDragging}
          onActiveElementChange={onActiveElementChange}
          setIsMoving={setIsMoving}
          isResizing={isResizing}
          setIsResizing={setIsResizing}
        />
      ))}
    </ElementRenderer>
  ) : (
    <SortableGroup
      elementRenderer={ElementRenderer}
      isActive={getIsActive}
      disableSortable={!isMoving || disableInteractions}
      disableInteractions={disableInteractions}
      isPutItem={getIsPutItem(type)}
      group={getGroupName(type)}
      onChoose={handleChooseToSort}
      isSomeItemBeingDragged={isDragging}
      isSomeItemResizable={isResizable}
      onChange={handleItemPositionChange}
      {...commonRendererProps}
      {...getAdditionalProps()}
      {...restProps}
    >
      {(item.children as LibraryElementUnion[])?.map((child) => (
        <SortableContainer
          key={child.id}
          activeItemId={activeItemId}
          isMoving={isMoving}
          item={child}
          listNotDragging={listNotDragging}
          onActiveElementChange={onActiveElementChange}
          setIsMoving={setIsMoving}
          isResizing={isResizing}
          setIsResizing={setIsResizing}
        />
      ))}
    </SortableGroup>
  );
};

export const SortableContainer = connect(mapStateToProps, mapDispatchToProps)(SortableComponent);
