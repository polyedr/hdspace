import React, { useCallback, useState } from 'react';
import * as R from 'ramda';
import { connect } from 'react-redux';
import { RENDERERS } from '../../UI/RenderElements';
import { SharedRendererProps } from '../../UI/RenderElements/types';
import SortableGroup from '../SortableGroup/SortableGroup';
import {
  AVAILABLE_CHILDREN,
  ElementEntity,
  Entity,
} from '../../../domain/core';
import { LibraryElement, LibraryElementUnion } from '../../../api/types';
import { LIST_SCENARIO_TYPE } from '../../../constants/defaultParams';
import { Indices, SavedElementsValues } from '../../../redux/project/types';
import { LIBRARY_ELEMENTS } from '../../../domain/libraryElements/libraryElements';
import { findParentByChildID } from '../../../utils/ElementsTreeHelper';
import { AppReduxState } from '../../../shared/types/app';
import { convertPropCSS } from '../../../utils/StyleHelper';
import {
  selectCurrentProject,
  selectCurrentScreen,
  selectElementsTree,
  selectRootId,
  selectSavedElementsValues,
  selectScreenLoader,
  selectShowingBorders,
} from '../../../redux/project/selectors';
import {
  moveElement,
  updateSavedElementValues,
} from '../../../redux/project/actions';

const isElementStructType = (type: string): type is ElementEntity => {
  return type in LIBRARY_ELEMENTS;
};

const mapStateToProps = (state: AppReduxState) => {
  const currentProject = selectCurrentProject(state);
  const projectClasses = currentProject.projectData.classes;
  const currentScreen = selectCurrentScreen(state);
  // const root = selectRootElement(state);
  const root = selectElementsTree(state);
  const rootID = selectRootId(state);
  const showBorders = selectShowingBorders(state);
  const savedElements = selectSavedElementsValues(state);
  const disableInteractions = state.user.isPrototypeMode;
  const screenLoader = selectScreenLoader(state);

  return {
    root,
    rootID,
    showBorders,
    disableInteractions,
    currentScreen,
    savedElements,
    projectClasses,
    screenLoader,
  };
};

const mapDispatchToProps = {
  moveElement,
  updateSavedElementValues,
};

export type OwnProps = {
  item: LibraryElementUnion;
  activeItemId: string;
  isMoving: boolean;
  listNotDragging: string[];
  isResizing: boolean;
  isResizable?: boolean;

  onActiveElementChange(parentId: number, child: LibraryElement<Entity>): void;
  setIsMoving: (value: boolean) => void;
  setIsResizing: (value: boolean) => void;
};

type Props = OwnProps &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

const SortableComponent: React.FC<Props> = ({
  root,
  rootID,
  showBorders,
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
  savedElements,
  projectClasses,
  updateSavedElementValues,
  screenLoader,
  ...restProps
}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleChooseToSort = (itemIndex: number) => {
    // TODO: called when item chosen for sorting. rewrite without onActiveElementChange use
    setIsDragging(true);
    const draggedItem = (item.children as LibraryElementUnion[]).find(
      (child) => child.buoyancy === itemIndex,
    );
    const itemID = draggedItem?.id;

    if (itemID !== activeItemId && draggedItem && itemID) {
      onActiveElementChange(Number(itemID), draggedItem);
    }
  };

  const handleItemPositionChange = (
    indices: Indices,
    parentId: string,
    isRemote?: boolean,
  ) => {
    setIsDragging(!!isRemote);
    moveElement(
      indices,
      activeItemId,
      parentId === 'root' ? rootID.toString() : parentId,
      isRemote,
      { screenId: currentScreen.id },
    );
  };

  const getGroupName = useCallback(
    (itemType): string =>
      LIST_SCENARIO_TYPE.indexOf(itemType) !== -1 ? itemType : 'element',
    [],
  );

  const getIsPutItem = (type: Entity): boolean | string[] => {
    const availableChildren = Object.keys(AVAILABLE_CHILDREN[type]);
    const put = R.head(availableChildren) === 'all' ? true : availableChildren;
    return listNotDragging.indexOf(type) === -1 && put;
  };

  const isRadioChecked = (
    value: string,
    checkedRadio: SavedElementsValues[string],
  ) => value === checkedRadio?.savedValue;

  const isCheckboxChecked = (itemId: string) =>
    Boolean(savedElements[itemId]?.savedValue);

  const getIsActive = !disableInteractions && item.id === activeItemId;

  const { id, type, styles, children } = item;

  if (!isElementStructType(type)) {
    return null;
  }

  const ElementRenderer = RENDERERS[type];
  const ownStyles = convertPropCSS(styles.ownStyles);

  const [entityClass, groupClass] = item.styles.classNames;

  const entityStyles =
    projectClasses?.find((cssClass: any) => cssClass.className === entityClass)
      ?.rules || {};
  const groupStyles =
    projectClasses?.find((cssClass: any) => cssClass.className === groupClass)
      ?.rules || {};

  const convertedEntityStyles = convertPropCSS(entityStyles);
  const convertedGroupStyles = convertPropCSS(groupStyles);

  const isBorderedElement =
    findParentByChildID(root, id)?.id === rootID || id === rootID;
  const isBorderVisible =
    (isBorderedElement && showBorders) || (isBorderedElement && getIsActive);

  const commonRendererProps: Omit<SharedRendererProps, 'children'> = {
    ...(disableInteractions && { className: '' }),
    id: id === rootID ? 'root' : id,
    isDisabled: !disableInteractions,
    ownStyles,
    entityStyles: convertedEntityStyles,
    groupStyles: convertedGroupStyles,
    active: !disableInteractions && id === activeItemId,
    sortableId: id,
    elementRef: null,
  };

  const getAdditionalProps = () => {
    switch (item.type) {
      case 'container':
      case 'divBlock': {
        return {
          isBorderVisible,
        };
      }
      case 'textinput': {
        return {
          ...commonRendererProps,
          currentValue: String(savedElements[id]?.savedValue),
          onElementChange: updateSavedElementValues,
          params: item.parameters,
        };
      }

      case 'textarea': {
        return {
          currentValue: savedElements[id]?.savedValue,
          onElementChange: updateSavedElementValues,
          params: item.parameters,
        };
      }

      case 'checkbox': {
        return {
          currentValue: savedElements[id]?.savedValue,
          isCheckboxChecked: isCheckboxChecked(id),
          onElementChange: updateSavedElementValues,
          params: item.parameters,
        };
      }

      case 'radiobutton': {
        return {
          currentValue: savedElements[id]?.savedValue,
          isRadioChecked: isRadioChecked(
            item.parameters.value,
            savedElements[item.parameters.name],
          ),
          onElementChange: updateSavedElementValues,
          params: item.parameters,
        };
      }

      case 'select': {
        return {
          currentValue: savedElements[id]?.savedValue,
          onElementChange: updateSavedElementValues,
          childrenElements: children,
          params: item.parameters,
          projectClasses,
        };
      }

      default:
        return {
          params: item.parameters,
        };
    }
  };

  if (screenLoader) {
    return null;
  }

  return disableInteractions ? (
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

export const SortableContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SortableComponent);
