import produce from 'immer';
import { AVAILABLE_CHILDREN } from '@Domain/core';
import {
  Entity,
  Indices,
  LibraryElement,
  Normalized,
  ParentIds,
  StateElement,
  StateElementsToAdd,
} from '@Src/types';

export const arrayToMap = <T extends { id: any }>(arr: T[]): Normalized<T> => {
  const res = {};
  arr.forEach((item) => {
    res[item.id] = item;
  });
  return res;
};

export const mapToArr = <T extends { id: string | number }>(
  map: Normalized<T>,
): T[] => Object.values(map);

export const flattenElements = (
  elements: LibraryElement<any>[],
  parent?: string,
): Normalized<StateElement> =>
  elements.reduce(
    (acc, element) => ({
      ...acc,
      [element.id]: {
        ...element,
        children: element.children.map((child) => child.id),
        parent,
      },
      ...flattenElements(element.children, element.id),
    }),
    {},
  );

export const buildElementsTree = (
  elements: Normalized<StateElement>,
  rootElementId: string,
): LibraryElement<any> => {
  const rootElement = elements[rootElementId];

  return {
    ...rootElement,
    children: rootElement?.children?.map((childId) =>
      buildElementsTree(elements, childId),
    ),
  };
};

export const buildGroupElementsTree = (
  elements: Normalized<StateElement>,
  rootElementId: string,
  paramsToOmit: string[] = [],
): LibraryElement<any> => {
  const rootElement = elements[rootElementId];
  const rootElementParams = rootElement
    ? {
        ...(rootElement.parameters
          ? Object.keys(rootElement.parameters)
              .filter((paramName) => !paramsToOmit.includes(paramName))
              .reduce((params, paramName) => {
                return {
                  ...params,
                  [paramName]: rootElement.parameters[paramName],
                };
              }, {})
          : {}),
        sourceElementId: rootElement.id,
      }
    : {};
  return {
    ...rootElement,
    parameters: rootElementParams,
    children: rootElement.children.map((childId) =>
      buildGroupElementsTree(elements, childId, paramsToOmit),
    ),
  };
};

export const getAllElementChildrenIds = (
  elements: Normalized<StateElement>,
  id: string,
) => {
  const element = elements[id];
  const childIds = [id];
  element.children.forEach((childId) => {
    childIds.push(...getAllElementChildrenIds(elements, childId));
  });
  return childIds;
};

export const removeMapElement = (
  state: Normalized<StateElement>,
  elementId: string,
): Normalized<StateElement> =>
  produce(state, (draft) => {
    const target = draft[elementId];

    if (target.parent) {
      const parent = draft[target.parent];
      parent.children = parent.children.filter((id) => id !== elementId);
      parent.children.forEach((id, i) => {
        draft[id].buoyancy = i;
      });
    }
  });

export const removeMapElements = (
  state: Normalized<StateElement>,
  ids: string[],
): Normalized<StateElement> =>
  produce(state, (draft) => {
    ids.forEach((id) => {
      const target = draft[id];
      if (target.parent) {
        const parent = draft[target.parent];
        parent.children = parent.children.filter(
          (childId) => !ids.includes(childId),
        );
        parent.children.forEach((childId, index) => {
          draft[childId].buoyancy = index;
        });
      }
    });
  });

export const addMapElements = (
  state: Normalized<StateElement>,
  elements: StateElementsToAdd<Entity>[],
): Normalized<StateElement> => {
  return produce(state, (draft) => {
    elements.forEach((elementToAdd) => {
      const { elements, parentId, index: insertIndex } = elementToAdd;

      const updatedChildren: Array<string> = [];
      if (insertIndex === undefined) {
        updatedChildren.push(...state[parentId].children);
        updatedChildren.push(...elements.map((el) => el.id));
      } else {
        updatedChildren.push(...state[parentId].children.slice(0, insertIndex));
        updatedChildren.push(...elements.map((el) => el.id));
        updatedChildren.push(...state[parentId].children.slice(insertIndex));
      }
      const flatElements = flattenElements(elements, parentId);
      Object.keys(flatElements).forEach((newElementId) => {
        draft[newElementId] = flatElements[newElementId];
      });
      const updatedParent = {
        ...draft[parentId],
        children: updatedChildren,
      };
      updatedParent.children.forEach((childId, index) => {
        draft[childId].buoyancy = index;
      });

      draft[parentId] = updatedParent;
    });
  });
};

export const updateMapElement = (
  state: Normalized<StateElement>,
  elementId: string,
  data: Partial<StateElement>,
): Normalized<StateElement> => {
  return produce(state, (draft) => {
    draft[elementId] = {
      ...draft[elementId],
      ...data,
    };
  });
};

export const moveMapElement = (
  state: Normalized<StateElement>,
  elementId: string,
  indices: Indices,
  parents: ParentIds,
): Normalized<StateElement> =>
  produce(state, (draft) => {
    const { newIndex, oldIndex } = indices;
    const { oldParentId, newParentId } = parents;

    draft[oldParentId].children.splice(oldIndex, 1);
    draft[oldParentId].children.forEach((id, i) => {
      draft[id] = {
        ...draft[id],
        buoyancy: i,
      };
    });

    draft[newParentId].children.splice(newIndex, 0, elementId);
    draft[newParentId].children.forEach((id, i) => {
      draft[id].buoyancy = i;
    });
    draft[elementId].parent = newParentId;
  });

export const insertMapElement = (
  state: Normalized<StateElement>,
  element: LibraryElement<any>,
  parentId: string,
  childId: string,
): Normalized<StateElement> => {
  const newState = { ...state, ...flattenElements([element], parentId) };
  const el = newState[element.id];
  const child = newState[childId];
  const parent = newState[parentId];

  parent.children.splice(child.buoyancy, 1, el.id);

  el.children = [childId];
  el.buoyancy = child.buoyancy;

  child.parent = el.id;
  child.buoyancy = 0;

  return newState;
};

export const insertMapElementWrapper = (
  state: Normalized<StateElement>,
  element: LibraryElement<any>,
  parentId: string,
  childIds: string[],
): Normalized<StateElement> => {
  const newState = { ...state, ...flattenElements([element], parentId) };
  const childElements = childIds.map((id) => newState[id]);
  const parent = newState[parentId];

  const minBuoyancy = Math.min(...childElements.map((elem) => elem.buoyancy));

  parent.children.splice(minBuoyancy, childIds.length, element.id);
  parent.children.forEach((childId, index) => {
    newState[childId].buoyancy = index;
  });
  element.children = childIds;
  element.buoyancy = minBuoyancy;
  [...childIds]
    .sort((a, b) => {
      return newState[a].buoyancy < newState[b].buoyancy ? -1 : 1;
    })
    .forEach((childId, index) => {
      newState[childId].parent = element.id;
      newState[childId].buoyancy = index;
    });
  newState[element.id] = {
    ...element,
    parent: parentId,
  };
  return newState;
};

export const removeMapElementWrapper = (
  state: Normalized<StateElement>,
  wrapperId: string,
  parentId: string,
  childIds: string[],
) => {
  const newState = { ...state };
  const parent = newState[parentId];
  const wrapper = newState[wrapperId];

  parent.children.splice(wrapper.buoyancy, 1, ...childIds);
  parent.children.forEach((childId, index) => {
    newState[childId].buoyancy = index;
    newState[childId].parent = parent.id;
  });
  childIds.forEach((id) => {
    newState[id].parent = parentId;
  });

  return newState;
};

export const extractMapElement = (
  state: Normalized<StateElement>,
  elementId: string,
): Normalized<StateElement> =>
  // eslint-disable-next-line consistent-return
  produce(state, (draft) => {
    const element = draft[elementId];
    if (!element.parent) return draft;

    const parent = draft[element.parent];
    parent.children.splice(element.buoyancy, 1, ...element.children);
    parent.children.forEach((id, i) => {
      draft[id].buoyancy = i;
    });

    element.children.forEach((id) => {
      draft[id].parent = parent.id;
    });

    element.children = [];
  });

export const restoreMapElement = (
  state: Normalized<StateElement>,
  elementId: string,
): Normalized<StateElement> =>
  // eslint-disable-next-line consistent-return
  produce(state, (draft) => {
    const element = draft[elementId];
    if (!element.parent) return draft;
    const parent = draft[element.parent];
    parent.children.splice(element.buoyancy, 0, element.id);

    parent.children.forEach((id, i) => {
      draft[id] = {
        ...draft[id],
        buoyancy: i,
      };
    });
  });

export const restoreMapElementChildren = (
  state: Normalized<StateElement>,
  elementId: string,
  childrenIds: string[],
): Normalized<StateElement> =>
  produce(state, (draft) => {
    const element = draft[elementId];
    const index = draft[childrenIds[0]].buoyancy;

    element.children.splice(index, 0, ...childrenIds);
    element.children = [...new Set(element.children)];
    element.children.forEach((id, i) => {
      draft[id].buoyancy = i;
      draft[id].parent = elementId;
    });
  });

export const canElementBeAdded = (
  elements: Normalized<StateElement>,
  parentId: string,
  childType: Entity,
): boolean => {
  const parent = elements[parentId];

  const sameTypeChildrenAmount =
    parent.children
      .map((id) => elements[id])
      .filter((child) => child.type === childType).length || 0;

  const availableChildrenType = AVAILABLE_CHILDREN[parent.type].all
    ? 'all'
    : childType;

  const availableSameChildren =
    AVAILABLE_CHILDREN[parent.type]?.[availableChildrenType];

  if (!availableSameChildren) {
    return false;
  }

  return sameTypeChildrenAmount < availableSameChildren.max;
};
