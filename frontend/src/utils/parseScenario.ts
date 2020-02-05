import * as R from 'ramda';

import { IDropDownOptions } from '$components/UI/DropDown';
import {
  LIST_SCENARIO_TYPE,
  ITemplateElement,
} from '$constants/defaultParams';
import {
  IScenarios,
  IScenarioItem,
  IScenarioElements,
  LibraryElements,
  LibraryElement,
  IListSortable,
  ILSItem,
  IScenarioElement,
  LibraryElementType,
  ServerFuncType,
} from '$redux/project/types';
import { IChooseElement } from '$components/ModalAddElements/ModalAddElements/ModalAddElements';
import { CssLikeStyles } from '$utils/StyleHelper';
import { ENTITIES } from '$domain/core';

export type GroupElement = {
  key: string,
  label: string,
  value: { structType: string, funcType: string },
};

export interface IListCategoryEl {
  [x: string]: LibraryElement[]
}

export const convertScenarios = (data: IScenarioItem[]): IScenarios => (
  data.reduce((obj, item) => ({ ...obj, [item.id]: item }), {})
);

export const getOptionsOfListScenario = (scenarios: IScenarios) => (
  Object.keys(scenarios).reduce((acc, key) => {
    const { name, struct_type } = scenarios[key];

    return struct_type === 'block' ? acc.concat({ value: key, label: name }) : acc;
  }, [] as IDropDownOptions<string>[])
);

export const convertScenarioElements = (
  scenarioElements: IScenarioElement[],
): IScenarioElements => scenarioElements.reduce((acc, el) => ({
    ...acc,
    [el.id]: {
      ...el,
      dynamic_buoyancy: el.dynamic_buoyancy || el.buoyancy,
    },
  }), {});

const getCategoryTab = (structType: LibraryElementType, libraryElements: LibraryElements, obj: IListCategoryEl) => {
  switch (structType) {
    case 'textinput':
      return { Input: [...obj.Input || [], ...R.values(libraryElements[structType])] };
    case 'map':
    case 'calendar':
    case 'clock':
      return { Widget: [...obj.Widget || [], ...R.values(libraryElements[structType])] };
    case 'select':
      return { Select: [...obj.Select || [], ...R.values(libraryElements[structType])] };
    case 'image':
      return { Image: [...obj.Image || [], ...R.values(libraryElements[structType])] };
    case 'button':
      return { Button: [...obj.Button || [], ...R.values(libraryElements[structType])] };

    default: return { Other: [...obj.Other || [], ...R.values(libraryElements[structType])] };
  }
};

export const parseAddElementsTabs = (libraryElements: LibraryElements): IListCategoryEl => (
  R.keys(libraryElements).reduce((acc, structType) => ({
    ...acc,
    ...getCategoryTab(structType, libraryElements, acc),
  }), {})
);

export const getCustomTemplateElements = (libraryElements: LibraryElements) => {
  return R.keys(libraryElements).reduce((acc: ITemplateElement[], structType) => {
    if (ENTITIES.some(x => x === structType)) {
      return acc.concat(R.values(libraryElements[structType]).map(element => ({
        label: `${structType}/${element.func_type}`,
        value: { funcType: element.func_type as ServerFuncType, structType },
        checked: false,
      })));
    }
    return acc;
  }, []);
};

export const getGroupElements = (group: string, listElement: IListCategoryEl): GroupElement[] => {
  switch (group) {
    case 'Button':
      return listElement.Button.map((x) => ({
        key: `key-${x.struct_type}-${x.func_type}`,
        value: { structType: x.struct_type, funcType: x.func_type },
        label: `button/${x.func_type}`,
      }));

    case 'Input':
      return listElement.Input.map((x) => ({
        key: `key-${x.struct_type}-${x.func_type}`,
        value: { structType: x.struct_type, funcType: x.func_type },
        label: `input/${x.func_type}`,
      }));

    case 'Select':
      return listElement.Select.map((x) => ({
        key: `key-${x.struct_type}-${x.func_type}`,
        value: { structType: x.struct_type, funcType: x.func_type },
        label: `select/${x.func_type}`,
      }));

    case 'Other':
      return listElement.Other.map((x, idx) => ({
        key: `key-${x.struct_type}-${x.func_type}-${idx}`,
        value: { structType: x.struct_type, funcType: x.func_type },
        label: `${x.struct_type}/${x.func_type}`,
      }));

    case 'Widget':
      return listElement.Widget
        .map((libraryElement, idx) => {
          const { struct_type, func_type, name = 'widget' } = libraryElement
          return {
            key: `key-${struct_type}-${func_type}-${idx}`,
            value: { structType: struct_type, funcType: func_type },
            label: name,
          };
        });

    default:
      return [];
  }
};

export const getChooseElements = (
  element: IChooseElement, chooseElements: IChooseElement[],
): IChooseElement[] => {
  const key = element.type !== 'Image' ? 'type' : 'id';

  return chooseElements.some(x => x[key] === element[key])
    ? chooseElements.filter(x => x[key] !== element[key])
    : [...chooseElements, element];
};

export const getCheckedElements = (listElements: ITemplateElement[]) => listElements.reduce(
  (acc: IChooseElement[], x) => x.checked
    ? acc.concat({ type: x.value.funcType, id: -100, structType: x.value.structType, funcType: x.value.funcType })
    : acc,
  []
);

export const getItemsPair = (
  LS: IListSortable,
  scenarios: IScenarios,
  scenarioElements: IScenarioElements,
): { scenarioList: IScenarios, elementList: IScenarioElements } => (
  Object.keys(LS).reduce((result, key) => {
    const { type, id } = LS[key];

    if (LIST_SCENARIO_TYPE.indexOf(type) !== -1 || type === 'root') {
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
  }, { scenarioList: {}, elementList: {} })
);

// getParams -> getParamsOfNonRootItem
export const getParams = (
  id: string,
  elementList: IScenarioElements,
  scenarioList: IScenarios,
): {
  struct_type: string,
  parameters: any,
  styles: CssLikeStyles,
  name: string,
  parent_id: number,
  type: string,
  image?: string,
} => {
  const parseId = parseInt(id, 10);

  if (id.slice(-1) === 's') {
    const currScenario = R.prop(parseId, scenarioList);

    return {
      struct_type: currScenario.struct_type || '',
      parameters: currScenario.parameters || {},
      styles: currScenario.styles || {},
      name: currScenario.name || 'name',
      parent_id: currScenario.parent_id ?? -1,
      type: currScenario.struct_type || 'undefined',
    };
  }

  const currElement = R.prop(parseId, elementList);

  return {
    struct_type: currElement.struct_type || '',
    parameters: currElement.parameters || {},
    styles: currElement.styles || {},
    name: currElement.name || 'name',
    parent_id: currElement.parameters.parent_id ?? -1,
    type: currElement.func_type || 'undefined',
    image: currElement.image || undefined,
  };
};

export const idToLSId = (id: number, type: string): string => {
  if (type === 'root') return type;

  const char = LIST_SCENARIO_TYPE.indexOf(type) !== -1 ? 's' : 'e';

  return `${id}${char}`;
};

export const scenarioItemToLS = ({ id, struct_type, parameters: { children } }: IScenarioItem): ILSItem => ({
  id,
  type: struct_type,
  children: children || [],
});

export const elementToLS = ({ id, struct_type }: IScenarioElement): ILSItem => ({
  id,
  type: struct_type,
  children: [],
});

export const getListNotDragging = (type: string): string[] => {
  switch (type) {
    case 'container': {
      return ['element'];
    }
  
    default:
      return ['element'];
  }
};
