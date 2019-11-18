import React, { CSSProperties, useCallback } from 'react';
import * as R from 'ramda';
import { connect } from 'react-redux';

import { AppReduxState } from '$shared/types/app';
import * as Actions from '$redux/project/actions';
import { ISortableItemTemp } from '$utils/parseListItems';
import { SortableGroup } from '$components/Editor/SortableGroup';
import { DragResize } from '$components/Editor/DragResize';
import { RENDERERS } from '$components/UI/RenderElements';
import { IEditProps, TOnChoose } from '$components/Editor/EditorWindow';
import { IListSortable } from '$redux/project/reducer';
import { getItemsPair, getParams, idToLSId } from '$utils/parseScenario';
import { LIST_SCENARIO_TYPE } from '$constants/defaultParams';
import { convertPropCSS } from '$utils/StyleHelper';

const mapStateToProps = (state: AppReduxState, props: OwnProps) => {
  const {
    currentScreen: { listSortable },
    scenarios,
    scenarioElements,
  } = state.project;
  const { isPrototypeMode } = state.user;
  const currId = props.item.id === 0 ? 'root' : idToLSId(props.item.id, props.item.type);
  const itemParent = listSortable[currId];
  const currListSortable = itemParent.children.reduce((items: IListSortable, childID) => ({
    ...items,
    [childID]: listSortable[childID],
  }), { [currId]: listSortable[currId] });
  const { scenarioList, elementList } = getItemsPair(currListSortable, scenarios, scenarioElements);

  return {
    listSortable: currListSortable,
    isPrototypeMode,
    scenarioList,
    elementList,
  };
};

const mapDispatchToProps = {
  updateElementStyles: Actions.updateElementStyles,
};

export type OwnProps = {
  item: ISortableItemTemp,
  activeItemId: string,
  isMoving: boolean,
  listNotDragging: string[],
  styles_root?,

  onActiveElementChange: TOnChoose,
  onChange: IEditProps['setListSortable'],
  setIsMoving: (value: boolean) => void,
}

type Props = OwnProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const RecursiveComponent: React.FC<Props> = (props) => {
  const {
    item,
    activeItemId,
    isMoving,
    listNotDragging,
    isPrototypeMode,
    onActiveElementChange,
    onChange,
    setIsMoving,
    styles_root,
  
    listSortable,
    elementList,
    scenarioList,
    updateElementStyles,
  } = props;
  // console.log(`props ${item.id}`, props);
  const handleChooseToSort = useCallback((itemIndex) => {
    if (item.children[itemIndex] !== activeItemId) {
      onActiveElementChange(item.id, item.children[itemIndex]);
    }
  }, [item, activeItemId, onActiveElementChange]);

  const handleChooseToResize = useCallback((itemId) => {
    if (activeItemId !== itemId) {
      onActiveElementChange(item.id, itemId);
    }
  }, [activeItemId, item.id, onActiveElementChange]);

  const handleItemPositionChange = useCallback((index, list, parentId) => {
    onChange(index, list, activeItemId, parentId);
  }, [activeItemId, onChange]);

  const getGroupName = useCallback((itemType): string => (
    LIST_SCENARIO_TYPE.indexOf(itemType) !== -1 ? itemType : 'element'
  ), []);

  const getIsPutItem = useCallback((type: string): boolean => (
    // я так понимаю эта штука отвечает за то что можно вкладывать итем или нет
    listNotDragging.indexOf(type) === -1
  ), [listNotDragging]);

  const getStyles = useCallback((id: number): CSSProperties => {
    const parseStyle: CSSProperties = (R.path([String(id), 'styles'], scenarioList));

    return parseStyle ? convertPropCSS(parseStyle) : {};
  }, [scenarioList]);

  return (
    <SortableGroup
      key={item.id}
      disableSortable={!isMoving}
      isPutItem={getIsPutItem(item.type)}
      parent={idToLSId(item.id, item.type)}
      group={getGroupName(item.type)}
      styleItem={{ flexDirection: getStyles(item.id).flexDirection }}
      onChoose={handleChooseToSort}
      onChange={handleItemPositionChange}
      align={item.props && item.props.align}
      styles_root={item.id === 0 ? convertPropCSS(styles_root) : {}}
      // styles_root={item.id === 0 ? convertPropCSS(styles_root) : {}}
    >
      {item.children.map((itemId) => {
        const elId = parseInt(itemId, 10);

        if (itemId.slice(-1) === 'e' ? !R.prop(elId, elementList) : !R.prop(elId, scenarioList)) {
          return null;
        }

        const currentItem = listSortable[itemId];
        const { struct_type, parameters, styles, name, image } = getParams(itemId, elementList, scenarioList);

        const renderElement = RENDERERS[struct_type];
        const isDraggable = activeItemId === itemId && LIST_SCENARIO_TYPE.indexOf(struct_type) === -1;

        if (renderElement) {
          const parsedStyles = convertPropCSS(styles);

          return (
            <DragResize
              key={`resize-${itemId}`}
              sortableId={itemId}
              style={parsedStyles}
              updateElementStyles={updateElementStyles}
              onChooseToResize={handleChooseToResize}
              setIsMoving={setIsMoving}
              isDraggable={isDraggable}
            >
              {renderElement({
                id: itemId,
                isDisabled: !isPrototypeMode,
                params: { ...parameters, image },
                name,
                style: parsedStyles,
                active: itemId === activeItemId,
                children: <Recursive
                  key={`element-${itemId}`}
                  activeItemId={activeItemId}
                  isMoving={isMoving}
                  item={currentItem as ISortableItemTemp}
                  listNotDragging={listNotDragging}
                  onActiveElementChange={onActiveElementChange}
                  onChange={onChange}
                  setIsMoving={setIsMoving}
                />,
              })}
            </DragResize>
          );
        }

        return null;
      })}
    </SortableGroup>
  );
};

export const Recursive = connect(mapStateToProps, mapDispatchToProps)(RecursiveComponent);
