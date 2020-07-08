import * as R from 'ramda';

import { IDropDownOptions } from '$components/UI/DropDown';
import {
  ITemplateElement,
} from '$constants/defaultParams';
import {
  IScenarios,
  IScenarioItem,
  IScenarioElements,
  LibraryElement,
  ILSItem,
  IScenarioElement,
  ServerStructType,
  CreatedElement,
} from '$redux/project/types';
import { ENTITIES, ElementEntity } from '$domain/core';
import { LibraryElements, ElementsToAdd } from '$domain/libraryElements/libraryElements';

export type GroupElement = {
  key: string,
  label: string,
  value: { structType: ServerStructType, funcType: ServerStructType },
};

export interface IListCategoryEl {
  [x: string]: LibraryElement[]
}

export const getOptionsOfListScenario = (scenarios: IScenarios) => (
  Object.keys(scenarios).reduce((acc) => {
    return acc;
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

const getCategoryTab = (structType: ElementEntity, libraryElements: ElementsToAdd, obj: IListCategoryEl) => {
  switch (structType) {
    case 'textinput':
    case 'textarea':        
    case 'checkbox':
    case 'radiobutton':
    case 'select':
    case 'button':
    case 'label':
      return { Form: [...obj.Form || [], libraryElements[structType]] };
    case 'heading':
    case 'paragraph':
    case 'hyperlink':
    case 'text_block':
    case 'list':    
      return { Typography: [...obj.Typography || [], libraryElements[structType]] };
    case 'map':
    case 'calendar':
    case 'clock':
      return { Widget: [...obj.Widget || [], libraryElements[structType]] };
    case 'image':
      return { Image: [...obj.Image || [], libraryElements[structType]] };
    case 'dropdown':
    case 'video':
    case 'undefined':
      return { Other: [...obj.Other || [], libraryElements[structType]] };
    default: return null;
  }
};

export const parseAddElementsTabs = (libraryElements: ElementsToAdd): IListCategoryEl => (
  R.keys(libraryElements).reduce((acc, structType) => ({
    ...acc,
    ...getCategoryTab(structType, libraryElements, acc),
  }), {})
);

export const getCustomTemplateElements = (libraryElements: LibraryElements) => {
  return R.keys(libraryElements).reduce((acc: ITemplateElement[], structType) => {
    if (R.keys(ENTITIES).some(x => x === structType)) {
      return acc.concat({
        label: `${structType}`,
        value: { funcType: structType, structType },
        checked: false,
      });
    }
    return acc;
  }, []);
};

export const getGroupElements = (group: string, listElement: IListCategoryEl): GroupElement[] => {
  switch (group) {
    case 'Typography':
      return listElement.Typography.map((x, idx) => ({
        key: `key-${x.struct_type}-${x.func_type}-${idx}`,
        value: { structType: x.struct_type, funcType: x.func_type },
        label: `${x.struct_type}`,
      }));

    case 'Form':
      return listElement.Form.map((x) => ({
        key: `key-${x.struct_type}-${x.func_type}`,
        value: { structType: x.struct_type, funcType: x.func_type },
        label: `${x.struct_type}`,
      }));

    case 'Other':
      return listElement.Other.map((x, idx) => ({
        key: `key-${x.struct_type}-${x.func_type}-${idx}`,
        value: { structType: x.struct_type, funcType: x.func_type },
        label: `${x.struct_type}`,
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

    case 'Image':
      return listElement.Image.map((x) => ({
        key: `key-${x.struct_type}-${x.func_type}`,
        value: { structType: x.struct_type, funcType: x.func_type },
        label: `${x.struct_type}`,
      }));    

    default:
      return [];
  }
};

export const getChooseElements = (
  element: CreatedElement, chooseElements: CreatedElement[],
): CreatedElement[] => {
  return chooseElements.some(x => x.type === element.type)
    ? chooseElements.filter(x => x.type !== element.type)
    : [...chooseElements, element];
};

export const getCheckedElements = (listElements: ITemplateElement[]) => listElements.reduce(
  (acc: CreatedElement[], x) => x.checked
    ? acc.concat({ type: x.value.structType })
    : acc,
  []
);

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
