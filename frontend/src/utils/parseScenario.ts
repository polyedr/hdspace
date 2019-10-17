import React, { useCallback } from 'react';
import * as R from 'ramda';

import { IListOptions } from '$components/UI/NestedList';
import { IDropDownOptions } from '$components/UI/DropDown';
import {
  DEFAULT_SCENARIO,
  DEFAULT_MAP_WIDGET,
  LIST_SCENARIO_TYPE,
  ITemplateElement,
} from '$constants/defaultParams';
import { uniqueId } from '$utils/NumberHelper';
import {
  IScenarios,
  IScenarioItem,
  IScenarioElements,
  ILibraryElements,
  ILibraryElement,
  IListSortable,
  ILSItem,
  IScenarioElement,
} from '$redux/project/reducer';
import { IChooseElement } from '$components/ModalAddElements/MainBlock';
import { IStylesElement } from '$utils/StyleHelper';

export interface IGroupElement {
  key: string,
  label: string,
  value: any,
}
export interface IListCategoryEl {
  [x: string]: ILibraryElement[]
}

type TParseScenarios = (data: IScenarioItem[]) => IScenarios;
type IFilterScenarioByScreenId = (screenId: number, scenarios: IScenarioItem[]) => IScenarios;
type TGetOptionsOfNestedList = (
  scenarios: IScenarios, elements: IScenarioElements
) => IListOptions[];
type TGetOptionsOfListScenario = (scenarios: IScenarios) => IDropDownOptions[];
type TUpdateElByScenarios = (
  scenarioId: number, elements: number[], scenarios: IScenarios
) => IScenarios;
type TGetAllElements = (
  oldScenarioId: number, newScenarioId: number,
  updateElements: number[], elements: IScenarioElements,
) => IScenarioElements;
type TGetElementsByType = (
  scenarioId: number, listElementType: IChooseElement[], libraryElements: ILibraryElements,
) => IScenarioElements;
type TGetNewScenario = (
  name: string, type: string, screenId: number, elements: number[],
) => IScenarioItem;
type TConvertScenarioElArrToObj = (elements: any[], listScenarioId: number[]) => IScenarioElements;
type TParseAddElementsTabs = (group: string, libraryElements: ILibraryElements) => IListCategoryEl;
type TGetGroupElements = (group: string, listElement) => IGroupElement[];
type TGetCustomTemplateElements = (libraryElements: ILibraryElements) => ITemplateElement[];
type TGetScenarioId = (
  id: string, listElement: IScenarioElements, listScenario: IScenarios,
) => number;
type TGetItemsPair = (
  LS: IListSortable, scenarios: IScenarios, scenarioElements: IScenarioElements
) => ({ scenarioList: IScenarios, elementList: IScenarioElements });
type TGetParams = (id: string, elementList: IScenarioElements, scenarioList: IScenarios) => ({
  struct_type: string,
  parameters: any,
  styles: IStylesElement,
  name: string,
  parent_id: number,
  type: string,
  image?: string,
});
type TParseScenarioLS = (item: IScenarioItem) => ILSItem;
type TParseElementLS = (item: IScenarioElement) => ILSItem;
type TScenarioToLS = (
  itemChildren,
  scenarios: IScenarios,
  scenarioEl: IScenarioElements
) => IListSortable;
type TGetParentId = (
  id: string, listElement: IScenarioElements, listScenario: IScenarios,
) => number;
type TGetListNotDragging = (
  type: string,
  parentId: number,
  parentType: string,
  scenarios: IScenarios
) => string[];

export const convertScenarios: TParseScenarios = data => (
  data.reduce((obj, item) => ({ ...obj, [item.id]: item }), {})
);

export const delElByScenarios: TUpdateElByScenarios = (scenarioId, elements, scenarios) => ({
  ...scenarios,
  [`${scenarioId}s`]: {
    ...scenarios[`${scenarioId}s`],
    elements: R.without(elements, scenarios[`${scenarioId}s`].elements),
  },
});

export const addElByScenarios: TUpdateElByScenarios = (scenarioId, elements = [], scenarios) => ({
  ...scenarios,
  [`${scenarioId}s`]: {
    ...scenarios[`${scenarioId}s`],
    elements: elements.reduce((arr, elId) => {
      if (arr.indexOf(elId) === -1) {
        return R.append(elId, arr);
      }
      return arr;
    }, scenarios[`${scenarioId}s`].elements),
  },
});

export const filterScenarioByScreenId: IFilterScenarioByScreenId = (screenId, scenarios) => {
  const updateScenarios = scenarios.filter(scenario => scenario.screen === screenId);

  return convertScenarios(updateScenarios);
};

export const getOptionsOfNestedList: TGetOptionsOfNestedList = (scenarios, elements) => (
  Object.keys(scenarios || {}).reduce((list, key) => {
    const {
      id,
      name,
      struct_type,
      elements: listEl,
    } = scenarios[key];

    if (struct_type === 'block') {
      const item = {
        name: `scenario-${id}`,
        label: name,
        value: key,
        elements: listEl.map((elId) => {
          const label: string = R.path([elId, 'func_type'], elements)
            || `${R.path([elId, 'struct_type'], scenarios)}${elId}`;

          return {
            name: String(elId),
            label,
            value: String(elId),
          };
        }),
      };

      return [...list, item];
    }

    return list;
  }, [])
);

export const getOptionsOfListScenario: TGetOptionsOfListScenario = scenarios => (
  Object.keys(scenarios || {}).reduce((list, key) => {
    const { name, struct_type } = scenarios[key];

    if (struct_type === 'block') {
      return R.append({
        value: key,
        label: name,
      }, list);
    }

    return list;
  }, [{ value: null, label: 'select scenario' }])
);

export const getNewScenario: TGetNewScenario = (name, type, screenId, elements = []) => ({
  ...DEFAULT_SCENARIO,
  screen: screenId,
  name,
  type,
  elements,
});

export const getAllElements: TGetAllElements = (
  oldScenarioId, newScenarioId, updateElements, elements,
) => updateElements.reduce((obj, id) => ({
  ...obj,
  [`${id}e`]: {
    ...elements[`${id}e`],
    scenario: elements[`${id}e`].scenario === oldScenarioId ? newScenarioId : oldScenarioId,
  },
}), elements);

export const filterScenarioEl: TConvertScenarioElArrToObj = (elements, listScenarioId) => (
  elements
    .filter(element => (
      listScenarioId.indexOf(element.scenario) !== -1
    ))
    .reduce((obj, el) => ({
      ...obj,
      [el.id]: {
        ...el,
        dynamic_buoyancy: el.dynamic_buoyancy || el.buoyancy,
      },
    }), {})
);

const getCategoryTab = (element: ILibraryElement, obj: IListCategoryEl) => {
  switch (element.struct_type) {
    case 'textinput':
      return { Input: [...obj.Input || [], element] };
    case 'map':
      return { Widget: [...obj.Widget || [], element] };
    case 'calendar':
      return { Widget: [...obj.Widget || [], element] };
    case 'clock':
      return { Widget: [...obj.Widget || [], element] };
    case 'select':
      return { Select: [...obj.Select || [], element] };
    case 'image':
      return { Image: [...obj.Image || [], element] };
    case 'button':
      return { Button: [...obj.Button || [], element] };

    default: return { Other: [...obj.Other || [], element] };
  }
};

export const getCustomTemplateElements: TGetCustomTemplateElements = libraryElements => (
  Object.keys(libraryElements).reduce((arr, key) => {
    const { struct_type } = libraryElements[key];
    if (['textinput', 'select', 'button', 'hyperlink', 'ocrtext', 'other'].indexOf(struct_type) !== -1) {
      const el = {
        label: key,
        value: key,
        checked: false,
      };

      return R.append(el, arr);
    }
    return arr;
  }, [])
);

export const parseAddElementsTabs: TParseAddElementsTabs = (group, libraryElements) => (
  Object.keys(libraryElements).reduce((obj, currEl) => ({
    ...obj,
    ...getCategoryTab(libraryElements[currEl], obj),
  }), {})
);

export const getGroupElements: TGetGroupElements = (group, listElement) => {
  switch (group) {
    case 'Button':
      return listElement.Button.map((el, idx) => ({
        key: `key-${el.func_type}`,
        value: el.func_type,
        label: `${el.parameters.group}/${idx + 1}`,
      }));

    case 'Input':
      return listElement.Input.map(el => ({
        key: `key-${el.parameters.placeholder}`,
        value: el.func_type,
        label: `${el.parameters.group}/${el.parameters.placeholder.toLowerCase()}`,
      }));

    case 'Select':
      return listElement.Select.map(el => ({
        key: `key-${el.func_type}`,
        value: el.func_type,
        label: `${el.parameters.group}/${el.func_type}`,
      }));

    case 'Other':
      return listElement.Other
        .filter(el => (typeof el.func_type) === 'string' && el.func_type !== '')
        .map((el, idx) => ({
          key: `key-${el.func_type}-${idx}`,
          value: el.func_type,
          label: el.func_type,
        }));

    case 'Widget':
      return listElement.Widget
        .filter(el => (typeof el.func_type) === 'string' && el.func_type !== '')
        .map((el, idx) => ({
          key: `key-${el.func_type}-${idx}`,
          value: el.func_type,
          label: el.name,
        }));

    default:
      return [];
  }
};

export const getChooseElements = (
  element: IChooseElement, chooseElements: IChooseElement[],
): IChooseElement[] => {
  const key = element.type !== 'Image' ? 'type' : 'id';

  return chooseElements.some(currEl => currEl[key] === element[key])
    ? chooseElements.filter(currEl => currEl[key] !== element[key])
    : [...chooseElements, element];
};

export const getCheckedElements = (listElements: ITemplateElement[]): IChooseElement[] => (
  listElements.reduce((arr, el) => {
    if (el.checked) {
      return R.append({ type: el.value }, arr);
    }

    return arr;
  }, [])
);

export const getListTypeElement = (libraryElements: ILibraryElements):IDropDownOptions[] => (
  Object.keys(libraryElements).reduce((arr, key) => {
    const { func_type, struct_type } = libraryElements[key];

    return R.append({ label: func_type || struct_type, value: key }, arr);
  }, [{ label: 'block', value: null }, { label: 'group', value: null }, { label: 'container', value: null }])
);

export const getScenarioId: TGetScenarioId = (id, listElement, listScenario) => {
  const parseId = parseInt(id, 10);

  const findParent = (itemId: number) => {
    const { parent_id, struct_type } = listScenario[itemId];

    if (struct_type === 'container' && parent_id === 0) {
      return -1;
    }

    return listScenario[parent_id].struct_type === 'block' ? parent_id : findParent(parent_id);
  };

  if (id.slice(-1) === 'e') {
    return R.path([parseId, 'scenario'], listElement) || -1;
  }

  const currItem = listScenario[parseId];

  switch (R.prop('struct_type', currItem)) {
    case 'block':
      return R.prop('id', currItem);
    case 'group':
    case 'container':
      return findParent(currItem.id);

    default:
      return -1;
  }
};

export const getItemsPair: TGetItemsPair = (LS, scenarios, scenarioElements) => (
  Object.keys(LS).reduce((result, key) => {
    if (!key || !LS[key]) return result;

    const { type, id } = LS[key];

    if (LIST_SCENARIO_TYPE.indexOf(type) !== -1) {
      return {
        ...result,
        scenarioList: {
          ...result.scenarioList,
          [id]: scenarios[id],
        },
      };
    }

    return {
      ...result,
      elementList: {
        ...result.elementList,
        [id]: scenarioElements[id],
      },
    };
  }, { scenarioList: null, elementList: null })
);

export const getParams: TGetParams = (id, elementList, scenarioList) => {
  const parseId = parseInt(id, 10);

  if (id.slice(-1) === 's') {
    const currScenario = R.prop(parseId, scenarioList);

    return {
      struct_type: R.path(['struct_type'], currScenario) || '',
      parameters: R.path(['parameters'], currScenario) || {},
      styles: R.path(['styles'], currScenario) || {},
      name: R.path(['name'], currScenario) || 'name',
      parent_id: R.path(['parent_id'], currScenario) || -1,
      type: R.path(['struct_type'], currScenario) || 'undefined',
    };
  }

  const currElement = R.prop(parseId, elementList);

  return {
    struct_type: R.prop('struct_type', currElement) || '',
    parameters: R.prop('parameters', currElement) || {},
    styles: R.prop('styles', currElement) || {},
    name: R.prop('name', currElement) || 'name',
    parent_id: R.path(['parameters', 'parent_id'], currElement) || -1,
    type: R.prop('func_type', currElement) || 'undefined',
    image: R.prop('image', currElement),
  };
};

export const idToLSId = (id: number, type: string): string => {
  if (id === 0) return 'root';

  const char = LIST_SCENARIO_TYPE.indexOf(type) !== -1 ? 's' : 'e';

  return `${id}${char}`;
};

const scenarioItemToLS: TParseScenarioLS = ({ id, struct_type, parameters: { children } }) => ({
  id,
  type: struct_type,
  children,
});

const elementToLS: TParseElementLS = ({ id, struct_type }) => ({
  id,
  type: struct_type,
  children: [],
});

export const scenarioToLS: TScenarioToLS = (itemChildren, scenarios, scenarioEl) => (
  itemChildren.sort((a, b) => b.buoyancy - a.buoyancy).reduce((result, item) => {
    if (!item) return result;
    const itemLS = LIST_SCENARIO_TYPE.indexOf(item.struct_type) !== -1
      ? { [`${item.id}s`]: scenarioItemToLS(item) }
      : { [`${item.id}e`]: elementToLS(item) };
    const children: string[] = (R.prop('children', R.values(itemLS)[0]) || []).sort((a: string, b: string) => {
      const parseIdA = parseInt(String(a), 10);
      const parseIdB = parseInt(String(b), 10);
      const buoyancyA: number = a.slice(-1) === 's'
        ? R.path([parseIdA, 'buoyancy'], scenarios) || 0
        : R.path([parseIdA, 'buoyancy'], scenarioEl) || 0;
      const buoyancyB: number = b.slice(-1) === 's'
        ? R.path([parseIdB, 'buoyancy'], scenarios) || 0
        : R.path([parseIdB, 'buoyancy'], scenarioEl) || 0;

      return buoyancyB - buoyancyA;
    });

    if (!R.isEmpty(children)) {
      const childList = children.map((childId) => {
        const id = parseInt(childId, 10);

        return childId.slice(-1) === 's'
          ? scenarios[id]
          : scenarioEl[id];
      }) || [];
      return {
        ...result,
        ...itemLS,
        ...scenarioToLS(childList, scenarios, scenarioEl),
      };
    }

    return {
      ...result,
      ...itemLS,
    };
  }, {})
);

export const getElementsByType: TGetElementsByType = (
  scenarioId, listElement, libraryElements,
) => (
  listElement.reduce((obj, element, idx) => {
    const defaultElement = libraryElements[element.type];

    if (defaultElement) {
      const serviceId = uniqueId(idx);
      // TODO: imgFile -> R.path(['img', 'file'], element)!
      return {
        ...obj,
        [serviceId]: {
          serviceId,
          struct_type: defaultElement.struct_type,
          scenario: scenarioId,
          func_type: element.type === 'widget' ? DEFAULT_MAP_WIDGET.func_type : defaultElement.func_type,
          buoyancy: defaultElement.buoyancy,
          parameters: {
            ...defaultElement.parameters,
            // source: R.path(['img', 'imgPreviewUrl'], element) || null,
            source: R.path(['img', 'file'], element) || null,
          },
          styles: defaultElement.styles,
        },
      };
    }

    return obj;
  }, {})
);

export const findParentType = (id: number, scenarios: IScenarios): string => {
  if (!R.is(Number, id)) return '';

  if (id === 0) return 'root';
  const { struct_type, parent_id } = scenarios[id];

  return struct_type === 'container'
    ? findParentType(parent_id, scenarios)
    : (parent_id && struct_type) || 'root';
};

export const getListNotDragging: TGetListNotDragging = (type, parentId, parentType, scenarios) => {
  switch (type) {
    case 'block': {
      return ['block', 'group', 'element'];
    }

    case 'group': {
      return ['group', 'element'];
    }

    case 'container': {
      const mainType = findParentType(parentId, scenarios);

      if (mainType === 'root') {
        return ['block', 'group', 'element'];
      }

      if (mainType === 'block') {
        return ['group', 'element'];
      }

      if (mainType === 'group') {
        return ['element'];
      }

      return [];
    }

    default:
      return [];
  }
};
