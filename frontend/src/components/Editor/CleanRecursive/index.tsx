import React, { useCallback, useEffect, useMemo } from 'react';
import * as R from 'ramda';
import { connect } from 'react-redux';

import * as Actions from '$redux/project/actions';
import { ISortableItemTemp } from '$utils/parseListItems';
import { RENDERERS } from '$components/UI/RenderElements';
import { IEditProps, TOnChoose } from '$components/Editor/EditorWindow';
import { IListSortable } from '$redux/project/reducer';
import { getItemsPair, getParams, idToLSId } from '$utils/parseScenario';

import { CleanRecursiveElement } from '$components/Editor/CleanRecursiveElement';
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

export type ICleanRecursiveProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & {
  item: ISortableItemTemp,
  activeItemId: string,
  isMoving: boolean,
  listNotDragging: string[],
  styles_root?,

  onChoose: TOnChoose,
  onChange: IEditProps['setListSortable'],
  setIsMoving: (value: boolean) => void,
}

const CleanRecursiveComponent: React.FunctionComponent<ICleanRecursiveProps> = ({
  item,
  activeItemId,
  isPrototypeMode,
  onChoose,
  styles_root,

  listSortable,
  elementList,
  scenarioList,
}) => {
  // const getStyles = useCallback((id: number): React.CSSProperties => {
  //   const parseStyle: React.CSSProperties = (R.path([String(id), 'styles'], scenarioList));

  //   return parseStyle ? convertPropCSS(parseStyle) : {};
  // }, [scenarioList]);

  return (
    <CleanRecursiveElement
      key={item.id}
      // styleItem={{ flexDirection: getStyles(item.id).flexDirection }}
      className={item.id === 0 ? 'root' : 'groupItem'}
      parent={item.id}
      styles_root={item.id === 0 ? convertPropCSS(styles_root) : {}}
      onclick={console.log}
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
          } = getParams(itemId, elementList, scenarioList);
          const element = RENDERERS[struct_type];

          if (element) {
            return (
              <React.Fragment key={`fragment-${itemId}`}>
                {
                  element({
                    id: itemId,
                    isDisabled: !isPrototypeMode,
                    isPrototypeMode,
                    params: parameters,
                    style: convertPropCSS(styles),
                    active: itemId === activeItemId,
                    children: <CleanRecursive
                      key={`prototype-${itemId}`}
                      item={currentItem}
                      activeItemId={activeItemId}
                      onChoose={onChoose}
                    />,
                  })
                }
              </React.Fragment>
            );
          }
          return null;
        })
      }
    </CleanRecursiveElement>
  );
};

export const CleanRecursive = connect(mapStateToProps, mapDispatchToProps)(CleanRecursiveComponent);
