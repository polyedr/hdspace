import React, { CSSProperties, useCallback, useEffect, useMemo } from 'react';
import * as R from 'ramda';
import { connect } from 'react-redux';

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

const mapStateToProps = (state, props) => {
  const {
    currentScreen: { listSortable },
    scenarios,
    scenarioElements,
  } = state.project;
  const { isPrototypeMode } = state.user;
  const currId = props.item.id === 0 ? 'root' : idToLSId(props.item.id, props.item.type);
  const itemParent = listSortable[currId];
  const currListSortable: IListSortable = itemParent.children.reduce((items, childId) => ({
    ...items,
    [childId]: listSortable[childId],
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

export type IRecursiveProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & {
  item: ISortableItemTemp,
  activeItemId: string,
  isMoving: boolean,
  listNotDragging: string[],
  styles_root?,

  onChoose: TOnChoose,
  onChange: IEditProps['setListSortable'],
  setIsMoving: (value: boolean) => void,
}

const RecursiveComponent: React.FunctionComponent<IRecursiveProps> = ({
  item,
  activeItemId,
  isMoving,
  listNotDragging,
  isPrototypeMode,
  onChoose,
  onChange,
  setIsMoving,
  styles_root,

  listSortable,
  elementList,
  scenarioList,
  updateElementStyles,
}) => {
  const handleChoose = useCallback((itemIndex) => {
    if (item.children[itemIndex] !== activeItemId) {
      onChoose(item.id, item.children[itemIndex]);
    }
  }, [item, activeItemId, onChoose]);

  const handleChooseResize = useCallback((itemId) => {
    if (activeItemId !== itemId) {
      onChoose(item.id, itemId);
    }
  }, [activeItemId, item.id, onChoose]);

  const handleChange = useCallback((index, list, parentId) => {
    onChange(index, list, activeItemId, parentId);
  }, [activeItemId, onChange]);

  const getGroupName = useCallback((itemType): string => (
    LIST_SCENARIO_TYPE.indexOf(itemType) !== -1 ? itemType : 'element'
  ), []);

  const getIsPutItem = useCallback((type: string): boolean => (
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
      onChoose={handleChoose}
      onChange={handleChange}
      align={item.props && item.props.align}
      styles_root={item.id === 0 ? convertPropCSS(styles_root) : {}}
      // styles_root={item.id === 0 ? convertPropCSS(styles_root) : {}}
    >
      {
        item.children.map((itemId) => {
          const elId = parseInt(itemId, 10);

          if (itemId.slice(-1) === 'e' ? !R.prop(elId, elementList) : !R.prop(elId, scenarioList)) {
            return null;
          }

          const currentItem = listSortable[itemId];
          const {
            struct_type,
            parameters,
            styles,
            name,
            image,
          } = getParams(itemId, elementList, scenarioList);
          // const type: string = currentItem.type !== 'undefined'
          //   ? currentItem.type
          //   : R.path(['props', 'source_img'], currentItem) ? 'image' : 'elem';
          const element = RENDERERS[struct_type];
          const isDraggable = activeItemId === itemId
            && LIST_SCENARIO_TYPE.indexOf(struct_type) === -1;

          if (element) {
            const parseStyles = convertPropCSS(styles);

            return (
              <DragResize
                key={`resize-${itemId}`}
                sortableId={itemId}
                style={parseStyles}
                updateElementStyles={updateElementStyles}
                onChooseResize={handleChooseResize}
                setIsMoving={setIsMoving}
                isDraggable={isDraggable}
              >
                {
                  element({
                    id: itemId,
                    isDisabled: !isPrototypeMode,
                    params: { ...parameters, image },
                    name,
                    style: parseStyles,
                    active: itemId === activeItemId,
                    children: <Recursive
                      key={`element-${itemId}`}
                      activeItemId={activeItemId}
                      isMoving={isMoving}
                      item={currentItem}
                      listNotDragging={listNotDragging}
                      onChoose={onChoose}
                      onChange={onChange}
                      setIsMoving={setIsMoving}
                    />,
                  })
                }
              </DragResize>
            );
          }
          return null;
        })
      }
    </SortableGroup>
  );
};

export const Recursive = connect(mapStateToProps, mapDispatchToProps)(RecursiveComponent);
