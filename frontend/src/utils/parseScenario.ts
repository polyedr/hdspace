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
  ILibraryElements,
  ILibraryElement,
  IListSortable,
  ILSItem,
  IScenarioElement,
} from '$redux/project/types';
import { IChooseElement } from '$components/ModalAddElements/MainBlock';
import { CssLikeStyles } from '$utils/StyleHelper';

export interface IGroupElement {
  key: string,
  label: string,
  value: any,
}
export interface IListCategoryEl {
  [x: string]: ILibraryElement[]
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

export const getCustomTemplateElements = (libraryElements: ILibraryElements) => (
  Object.keys(libraryElements).reduce((acc: ITemplateElement[], key) => {
    const { struct_type } = libraryElements[key];
    if (['textinput', 'select', 'button', 'hyperlink', 'ocrtext', 'other'].indexOf(struct_type) !== -1) {
      return acc.concat({
        label: key,
        value: key,
        checked: false,
      });
    }
    return acc;
  }, [])
);

export const parseAddElementsTabs = (group: string, libraryElements: ILibraryElements): IListCategoryEl => (
  Object.keys(libraryElements).reduce((obj, currEl) => ({
    ...obj,
    ...getCategoryTab(libraryElements[currEl], obj),
  }), {})
);

export const getGroupElements = (group: string, listElement: IListCategoryEl): IGroupElement[] => {
  console.log('getGroupElements!', group, listElement);
  switch (group) {
    case 'Button':
      return listElement.Button.map((el, idx) => ({
        key: `key-${el.func_type}`,
        value: el.func_type,
        label: `${el.parameters.group}/${idx + 1}`,
      }));

    case 'Input':
      return listElement.Input.map(({ parameters: { placeholder = '', group }, func_type }) => ({
        key: `key-${placeholder}`,
        value: func_type,
        label: `${group}/${placeholder.toLowerCase()}`,
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
      console.log('Widget!', listElement.Widget);
      return listElement.Widget
        .filter(el => (typeof el.func_type) === 'string' && el.func_type !== '')
        .map((libraryElement, idx) => {
          const { func_type, name = '' } = libraryElement as ILibraryElement & { name: string };
          return {
            key: `key-${func_type}-${idx}`,
            value: func_type,
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

export const getCheckedElements = (listElements: ITemplateElement[]) => (
  listElements.reduce((acc: IChooseElement[], x) => x.checked ? acc.concat({ type: x.value, id: -100 }) : acc, [])
);

// resolve IDropDownOptions type here
export const getListTypeElement = (libraryElements: ILibraryElements): IDropDownOptions<string>[] => (
  Object.keys(libraryElements).reduce((arr, key) => {
    const { func_type, struct_type } = libraryElements[key];

    return arr.concat({ label: func_type || struct_type, value: key });
  }, [{ label: 'container', value: 'container' }] as IDropDownOptions<string>[] )
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
