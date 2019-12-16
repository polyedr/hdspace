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
} from '$redux/project/types';
import { IChooseElement } from '$components/ModalAddElements/MainBlock';
import { IStylesElement } from '$utils/StyleHelper';

import { greaterBuoyancyFirst, isElement, isScenario } from './model';

// TODO: remove unused helpers

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

export const getOptionsOfNestedList = (scenarios: IScenarios, elements: IScenarioElements) => {
  return Object.keys(scenarios).reduce((acc: IListOptions[], key) => {
    const {
      id,
      name,
      struct_type,
      elements: listEl,
    } = scenarios[key];

    if (struct_type === 'block') {
      const item: IListOptions = {
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

      return [...acc, item];
    }

    return acc;
  }, []);
};

export const getOptionsOfListScenario = (scenarios: IScenarios) => (
  Object.keys(scenarios).reduce((acc, key) => {
    const { name, struct_type } = scenarios[key];

    return struct_type === 'block' ? acc.concat({ value: key, label: name }) : acc;
  }, [] as IDropDownOptions<string>[])
);

export const getNewScenario = (
  name: string,
  type: string,
  screenId: number,
  elements: number[] = [],
): IScenarioItem => ({
  ...DEFAULT_SCENARIO,
  screen: screenId,
  name,
  type,
  elements,
});

export const getAllElements = (
  oldScenarioId: number,
  newScenarioId: number,
  updateElements: number[],
  elements: IScenarioElements,
): IScenarioElements => updateElements.reduce((obj, id) => ({
  ...obj,
  [`${id}e`]: {
    ...elements[`${id}e`],
    scenario: elements[`${id}e`].scenario === oldScenarioId ? newScenarioId : oldScenarioId,
  },
}), elements);

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
  }, [{ label: 'block', value: 'block' }, { label: 'group', value: 'group' }, { label: 'container', value: 'container' }] as IDropDownOptions<string>[] )
);

export const getScenarioId = (
  idAsString: string,
  scenariosElements: IScenarioElements,
  scenarios: IScenarios,
): number => {
  const scenarioID = parseInt(idAsString, 10);

  if (isElement(idAsString)) {
    return R.path([scenarioID, 'scenario'], scenariosElements) || -1;
  }

  const findParent = (itemId: number): number => {
    const { parent_id, struct_type } = scenarios[itemId];

    if (struct_type === 'container' && parent_id === 0) {
      return -1;
    }

    return scenarios[parent_id].struct_type === 'block' ? parent_id : findParent(parent_id);
  };

  const currItem = scenarios[scenarioID];

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
  styles: IStylesElement,
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

export const scenarioToLS = (
  parents: (IScenarioItem | IScenarioElement)[],
  scenarios: IScenarios,
  scenarioEl: IScenarioElements,
): IListSortable => {
  return parents.sort(greaterBuoyancyFirst).reduce((acc: IListSortable, parent) => {

    const parentAsLSItem = isScenario(parent)
      ? { [`${parent.id}s`]: scenarioItemToLS(parent) }
      : { [`${parent.id}e`]: elementToLS(parent) };

    const rawChildrenIDs = R.values(parentAsLSItem)[0].children;
    const childrenIDs = rawChildrenIDs.sort((a, b) => {
      const aID = parseInt(a, 10);
      const bID = parseInt(b, 10);
      const buoyancyA = a.slice(-1) === 's' ? scenarios[aID].buoyancy : scenarioEl[aID].buoyancy;
      const buoyancyB = b.slice(-1) === 's' ? scenarios[bID].buoyancy : scenarioEl[bID].buoyancy;
      return buoyancyB - buoyancyA;
    });

    if (!R.isEmpty(childrenIDs)) {
      const parentChildren = childrenIDs.map((childIDasString) => {
        const childID = parseInt(childIDasString, 10);
        return childIDasString.slice(-1) === 's' ? scenarios[childID] : scenarioEl[childID];
      });

      return {
        ...acc,
        ...parentAsLSItem,
        ...scenarioToLS(parentChildren, scenarios, scenarioEl),
      };
    }

    return {
      ...acc,
      ...parentAsLSItem,
    };
  }, {})
};

export const getElementsByType = (
  scenarioId: number,
  listElementType: IChooseElement[],
  libraryElements: ILibraryElements,
): IScenarioElements => (
  listElementType.reduce((obj, element, idx) => {
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

  return struct_type === 'container' ? findParentType(parent_id, scenarios) : ((parent_id && struct_type) || 'root');
};

export const getListNotDragging = (type: string): string[] => {
  switch (type) {
    case 'container': {
      return ['element'];
    }
  
    default:
      return ['element'];
  }
};
