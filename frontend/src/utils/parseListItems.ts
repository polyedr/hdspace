import * as R from 'ramda';
import { ISortableItem, IScreenProps, IListSortable } from '$redux/project/reducer';
import { uniqueId } from './NumberHelper';
// import { parseWidth } from '$utils/StyleHelper';

export interface ISortableItemTemp {
  id: number,
  elementId: number,
  children: string[],
  type: string,
  orientation?: string,
  props?: IScreenProps,
  scenarioId?: number, // why?
}

// export const parseList: TParseList = (items = []) => (
//   items.reduce((obj, item) => ({
//     ...obj,
//     [itemId(item)]: {
//       id: itemId(item),
//       elementId: item.id,
//       type: item.type,
//       children: listChildren(item),
//       props: {
//         ...item.props,
//         width: parseWidth(item),
//       },
//       orientation: item.orientation,
//       scenarioId: item.scenarioId,
//     },
//     ...(
//       (
//         item.children && item.children.length > 0
//         && parseList(item.children, itemId(item))
//       ) || {}),
//   }), {})
// );

// export const getList: TParseList = (items = [], styles) => ({
//   root: itemRoot(items, styles),
//   ...parseList(items),
// });

// export const getListReverse: FnParseListReverse = (listItems, parent = 'root') => (
//   listItems[parent].children.map((item) => {
//     if (listItems[item].children) {
//       return ({
//         id: listItems[item].elementId,
//         children: getListReverse(listItems, item),
//         type: listItems[item].type,
//         orientation: listItems[item].orientation,
//         props: listItems[item].props,
//         scenarioId: listItems[item].scenarioId,
//       });
//     }
//
//     return ({
//       id: listItems[item].elementId,
//       children: [],
//       type: listItems[item].type,
//       orientation: listItems[item].orientation,
//       props: listItems[item].props,
//       scenarioId: listItems[item].scenarioId,
//     });
//   })
// );

export const getElAndChildren = (id: string, listSortable: IListSortable): string[] => (
  (Array(R.path([id, 'children'], listSortable)) || []).reduce((listItem, childId) => {
    const childrenItem: string[] = R.path([id, 'children'], listSortable) || [];

    if (childrenItem.length) {
      return [
        ...listItem,
        ...childrenItem.reduce((listChild, currId) => (
          [...listChild, ...getElAndChildren(currId, listSortable)]
        ), [childId])];
    }

    return [...listItem, childId];
  }, [id])
);
