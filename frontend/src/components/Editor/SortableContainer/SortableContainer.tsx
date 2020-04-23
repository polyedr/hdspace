import React, { CSSProperties, useCallback, useState, useEffect } from 'react';
import * as R from 'ramda';
import { connect } from 'react-redux';

import { AppReduxState } from '$shared/types/app';
import { SortableGroup } from '$components/Editor/SortableGroup/SortableGroup';
import { RENDERERS } from '$components/UI/RenderElements';
import { IListSortable, ILSItem, SavedElementsValues, Option } from '$redux/project/types';
import { selectors, actionsCreators } from '$redux/project';
import { getItemsPair, getParams, idToLSId, idToDataLSID } from '$utils/parseScenario';
import { LIST_SCENARIO_TYPE } from '$constants/defaultParams';
import { convertPropCSS, CssLikeStyles } from '$utils/StyleHelper';
import { LIBRARY_ELEMENTS } from '$domain/libraryElements';
import { ElementEntity } from '$domain/core';

const isElementStructType = (type: string): type is ElementEntity => {
  return type in LIBRARY_ELEMENTS;
};

const mapStateToProps = (state: AppReduxState, props: OwnProps) => {
  const currentScreen = selectors.selectCurrentScreen(state);
  const { listSortable } = selectors.selectCurrentScreen(state);
  const scenarios = selectors.selectScenarios(state);
  const scenarioElements = selectors.selectScenariosElements(state);
  const savedElements = selectors.selectSavedElementsValues(state);
  const disableInteractions = state.user.isPrototypeMode;

  const currId = idToLSId(props.item.id, props.item.type);
  const itemParent = listSortable[currId];
  const currentListSortable = itemParent.children.reduce((items: IListSortable, childID) => ({
    ...items,
    [childID]: listSortable[childID],
  }), { [currId]: listSortable[currId] });

  const { scenarioList, elementList } = getItemsPair(currentListSortable, scenarios, scenarioElements);
  return {
    listSortable,
    scenarioElements,
    currentListSortable,
    disableInteractions,
    scenarioList,
    elementList,
    currentScreen,
    savedElements,
  };
};

const mapDispatchToProps = {
  updateElementStyles: actionsCreators.updateElementStyles,
  setListSortable: actionsCreators.setListSortable,
  updateSavedElementValues: actionsCreators.updateSavedElementValues,
};

export type OwnProps = {
  item: ILSItem,
  activeItemId: string,
  isMoving: boolean,
  listNotDragging: string[],
  isResizing: boolean;
  isResizable?: boolean;

  onActiveElementChange(parentId: number, childID: string): void,
  setIsMoving: (value: boolean) => void,
  setIsResizing: (value: boolean) => void;
}

type Props = OwnProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const SortableComponent: React.FC<Props> = (props) => {
  const {
    currentScreen,
    item,
    activeItemId,
    isMoving,
    listNotDragging,
    disableInteractions,
    onActiveElementChange,
    setListSortable,
    setIsMoving,
    isResizing,
    setIsResizing,
    isResizable,
    listSortable,
    scenarioElements,
    currentListSortable,
    elementList,
    scenarioList,
    savedElements,
    updateSavedElementValues,
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

  const handleChooseToSort = useCallback((itemIndex) => {
    // TODO: called when item chosen for sorting. rewrite without onActiveElementChange use
    setIsDragging(true);
    if (item.children[itemIndex] !== activeItemId) {
      onActiveElementChange(item.id, item.children[itemIndex]);
    }
  }, [item, activeItemId, onActiveElementChange]);

  const handleItemPositionChange = useCallback((index: number, list: string[], parentId: string) => {
    setIsDragging(false);
    setListSortable(index, list, activeItemId, parentId);
  }, [activeItemId, setListSortable]);

  const getGroupName = useCallback((itemType): string => (
    LIST_SCENARIO_TYPE.indexOf(itemType) !== -1 ? itemType : 'element'
  ), []);

  const getIsPutItem = useCallback((type: string): boolean => (
    listNotDragging.indexOf(type) === -1
  ), [listNotDragging]);

  const getStyles = useCallback((id: number): CSSProperties => {
    if (id === -1) return {};
    const parseStyle: CssLikeStyles = scenarioList[id].styles;

    return parseStyle ? convertPropCSS(parseStyle) : {};
  }, [scenarioList]);

  const isRadioChecked = (value: string, checkedRadio: SavedElementsValues[string]) => value === checkedRadio?.savedValue;

  const isCheckboxChecked = (itemId: string) => Boolean(savedElements[itemId]?.savedValue);

  const getSelectValue = (itemId: string, options: Option[]) => {
    const selectValue = savedElements[itemId]?.savedValue;
    const isValueInOptions = options?.some(({ value }) => selectValue === value);

    return isValueInOptions ? selectValue : options?.[0].value || '';
  }

  const getIsActive = useCallback(() => !disableInteractions && item.id === parseInt(activeItemId, 10), [disableInteractions, item, activeItemId]);

  return (currentScreen && currentScreen.screenLoader ?  null :
    <SortableGroup
      isActive={getIsActive()}
      key={item.id}
      disableSortable={!isMoving || disableInteractions}
      disableInteractions={disableInteractions}
      isPutItem={getIsPutItem(item.type)}
      lsID={idToLSId(item.id, item.type)}
      id={idToDataLSID(item.id, item.type)}
      group={getGroupName(item.type)}
      stylesToInherit={getStyles(item.id)}
      onChoose={handleChooseToSort}
      onChange={handleItemPositionChange}
      isSomeItemBeingDragged={isDragging}
      isSomeItemResizable={isResizable}
    // align={item.props && item.props.align}
    >
      {item.children.map((itemId) => {
        const elId = parseInt(itemId, 10);

        if (itemId.slice(-1) === 'e' ? !R.prop(elId, elementList) : !R.prop(elId, scenarioList)) {
          return null;
        }

        const currentItem = currentListSortable[itemId];
        const { struct_type, parameters, styles, name, children } = getParams(itemId, elementList, scenarioList);

        if (struct_type === 'container') {
          return (
            <SortableContainer
              key={`element-${itemId}`}
              activeItemId={activeItemId}
              isMoving={isMoving}
              item={currentItem}
              listNotDragging={listNotDragging}
              onActiveElementChange={onActiveElementChange}
              setIsMoving={setIsMoving}
              isResizing={isResizing}
              setIsResizing={setIsResizing}
            />
          )
        } 

        if (!isElementStructType(struct_type)) {
          return null;
        }

        const ElementRenderer = RENDERERS[struct_type];
        const parsedStyles = convertPropCSS(styles);
        
        return ElementRenderer ? (
          <ElementRenderer
            key={itemId}
            id={itemId}
            isDisabled={!disableInteractions}
            params={parameters}
            sortableId={itemId}
            name={name}
            style={parsedStyles}
            active={!disableInteractions && itemId === activeItemId}
            inputValue={savedElements[itemId]?.savedValue}
            textareaValue={savedElements[itemId]?.savedValue}
            selectValue={getSelectValue(itemId, parameters.options)}
            onChange={updateSavedElementValues}
            isCheckboxChecked={isCheckboxChecked(itemId)}
            isRadioChecked={isRadioChecked(parameters.value, savedElements[parameters.name])}
            childrenElements={children}
           />
        ) : null;
      })}
    </SortableGroup>
  );
};

export const SortableContainer = connect(mapStateToProps, mapDispatchToProps)(SortableComponent);
