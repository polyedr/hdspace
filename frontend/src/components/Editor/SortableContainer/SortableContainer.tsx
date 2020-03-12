import React, { CSSProperties, useCallback, useState } from 'react';
import * as R from 'ramda';
import { connect } from 'react-redux';

import { AppReduxState } from '$shared/types/app';
import { SortableGroup } from '$components/Editor/SortableGroup/SortableGroup';
import { RENDERERS } from '$components/UI/RenderElements';
import { IListSortable, ILSItem } from '$redux/project/types';
import { selectors, actionsCreators } from '$redux/project';
import { getItemsPair, getParams, idToLSId, idToDataLSID } from '$utils/parseScenario';
import { LIST_SCENARIO_TYPE } from '$constants/defaultParams';
import { convertPropCSS, CssLikeStyles } from '$utils/StyleHelper';

const mapStateToProps = (state: AppReduxState, props: OwnProps) => {
  const { listSortable } = selectors.selectCurrentScreen(state);
  const scenarios = selectors.selectScenarios(state);
  const scenarioElements = selectors.selectScenariosElements(state);
  const disableInteractions = state.user.isPrototypeMode;

  const currId = idToLSId(props.item.id, props.item.type);
  const itemParent = listSortable[currId];
  const currListSortable = itemParent.children.reduce((items: IListSortable, childID) => ({
    ...items,
    [childID]: listSortable[childID],
  }), { [currId]: listSortable[currId] });

  const { scenarioList, elementList } = getItemsPair(currListSortable, scenarios, scenarioElements);
  return {
    listSortable: currListSortable,
    disableInteractions,
    scenarioList,
    elementList,
  };
};

const mapDispatchToProps = {
  updateElementStyles: actionsCreators.updateElementStyles,
  setListSortable: actionsCreators.setListSortable,
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
    elementList,
    scenarioList,
  } = props;

  const [isDragging, setIsDragging] = useState<boolean>(false);

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

  const getIsActive = useCallback(() => !disableInteractions && item.id === parseInt(activeItemId, 10), [disableInteractions, item, activeItemId]);

  return (
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

        const currentItem = listSortable[itemId];
        const { struct_type, parameters, styles, name } = getParams(itemId, elementList, scenarioList);

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

        // @ts-ignore
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
           />
        ) : null;
      })}
    </SortableGroup>
  );
};

export const SortableContainer = connect(mapStateToProps, mapDispatchToProps)(SortableComponent);
