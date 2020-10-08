import * as R from 'ramda';
/* eslint-disable camelcase */

import { IDropDownOptions } from '../components/UI/DropDown';
import {
  CreatedElement,
  ILSItem,
  IScenarioElement,
  IScenarioElements,
  IScenarioItem,
  IScenarios,
  ScenarioLibraryElement,
  ServerStructType,
  ElementData,
  ElementsHierarchy,
} from '../redux/project/types';
import { ITemplateElement } from '../constants/defaultParams';
import { ElementEntity } from '../domain/core';
import {
  ElementsToAdd,
  ICONS,
} from '../domain/libraryElements/libraryElements';
import { ServerElement } from '../api/types';

export type GroupElement = {
  key: string;
  name: string;
  label: string;
  custom?: boolean;
  value: { structType: ServerStructType; funcType: ServerStructType };
};

export interface IListCategoryEl {
  [x: string]: ScenarioLibraryElement[];
}

export const getOptionsOfListScenario = (scenarios: IScenarios) =>
  Object.keys(scenarios).reduce((acc) => {
    return acc;
  }, [] as IDropDownOptions<string>[]);

export const convertScenarioElements = (
  scenarioElements: IScenarioElement[],
): IScenarioElements =>
  scenarioElements.reduce(
    (acc, el) => ({
      ...acc,
      [el.id]: {
        ...el,
        dynamic_buoyancy: el.dynamic_buoyancy || el.buoyancy,
      },
    }),
    {},
  );

const getCategoryTab = (
  structType: ElementEntity,
  libraryElements: ElementsToAdd,
  obj: IListCategoryEl,
) => {
  switch (structType) {
    case 'divBlock':
    case 'pageTemplate':
    case 'emptyPageTemplate':
    case 'grid':
    case 'columns':
    case 'subscribeForm':
    case 'cardsSection':
    case 'featureSection':
    case 'section':
      return {
        Containers: [...(obj.Containers || []), libraryElements[structType]],
      };
    case 'textinput':
    case 'textarea':
    case 'checkbox':
    case 'radiobutton':
    case 'select':
    case 'button':
    case 'label':
      return { Form: [...(obj.Form || []), libraryElements[structType]] };
    case 'heading':
    case 'paragraph':
    case 'hyperlink':
    case 'textBlock':
    case 'list':
      return {
        Typography: [...(obj.Typography || []), libraryElements[structType]],
      };
    case 'map':
    case 'calendar':
    case 'clock':
      return { Widget: [...(obj.Widget || []), libraryElements[structType]] };
    case 'image':
      return { Image: [...(obj.Image || []), libraryElements[structType]] };
    case 'dropdown':
    case 'video':
    case 'undefined':
      return { Other: [...(obj.Other || []), libraryElements[structType]] };
    default:
      return null; // { Custom: [...(obj.Custom || []), };
  }
};

const convertElementToData = (
  element: ServerElement<any>,
  isCustom: boolean = false,
): ElementData => ({
  key: element.struct_type,
  type: element.struct_type,
  icon: ICONS[element.struct_type],
  name: element.name,
  custom: isCustom,
});

export const getRightPanelCategoryTabs = (
  structType: ElementEntity,
  libraryElements: ElementsToAdd,
  obj: any,
) => {
  switch (structType) {
    case 'columns':
    case 'grid':
    case 'section':
      return {
        elements: {
          ...obj.elements,
          layout: {
            ...(obj.elements?.layout || {}),
            [structType]: convertElementToData(libraryElements[structType]),
          },
        },
      };
    case 'list':
    case 'divBlock':
    case 'paragraph':
    case 'heading':
    case 'hyperlink':
    case 'image':
    case 'video':
    case 'textBlock':
    case 'undefined':
      return {
        elements: {
          ...obj.elements,
          basic: {
            ...(obj.elements?.basic || {}),
            [structType]: convertElementToData(libraryElements[structType]),
          },
        },
      };
    case 'button':
    case 'dropdown':
    case 'textinput':
    case 'textarea':
    case 'checkbox':
    case 'radiobutton':
    case 'label':
    case 'select':
      return {
        elements: {
          ...obj.elements,
          form: {
            ...(obj.elements?.form || {}),
            [structType]: convertElementToData(libraryElements[structType]),
          },
        },
      };
    case 'map':
    case 'calendar':
    case 'clock':
      return {
        elements: {
          ...obj.elements,
          widget: {
            ...(obj.elements?.widget || {}),
            [structType]: convertElementToData(libraryElements[structType]),
          },
        },
      };
    case 'subscribeForm':
    case 'cardsSection':
    case 'featureSection':
      return {
        library: {
          ...obj.library,
          adeviLibrary: {
            ...(obj.library?.adeviLibrary || {}),
            [structType]: convertElementToData(libraryElements[structType]),
          },
        },
      };

    case 'pageTemplate':
    case 'emptyPageTemplate':
      return {
        templates: {
          ...(obj.templates || {}),
          pageTemplate: [
            ...(obj.templates?.pageTemplate || []),
            convertElementToData(libraryElements[structType]),
          ],
        },
      };
    case 'screenshot':
      return {
        templates: {
          ...(obj.templates || {}),
          [structType]: convertElementToData(libraryElements[structType]),
        },
      };
    case 'container':
    case 'ocrtext':
    case 'root':
    default:
      return null;
  }
};

export const createElementsHierarchy = (
  libraryElements: ElementsToAdd,
): ElementsHierarchy =>
  R.keys(libraryElements).reduce(
    (acc, structType) => ({
      ...acc,
      ...getRightPanelCategoryTabs(structType, libraryElements, acc),
    }),
    {} as ElementsHierarchy,
  );

export const parseAddElementsTabs = (
  libraryElements: ElementsToAdd,
): IListCategoryEl =>
  R.keys(libraryElements).reduce((acc, structType) => {
    return {
      ...acc,
      ...getCategoryTab(structType, libraryElements, acc),
      custom: false,
    };
  }, {});

export const getGroupElements = (
  group: string,
  listElement: IListCategoryEl,
): GroupElement[] => {
  switch (group) {
    case 'Containers':
      return listElement.Containers.map((x, idx) => ({
        key: `key-${x.struct_type}-${x.func_type}-${idx}`,
        name: x.name,
        value: { structType: x.struct_type, funcType: x.func_type },
        label: `${x.struct_type}`,
      }));

    case 'Typography':
      return listElement.Typography.map((x, idx) => ({
        key: `key-${x.struct_type}-${x.func_type}-${idx}`,
        name: x.name,
        value: { structType: x.struct_type, funcType: x.func_type },
        label: `${x.struct_type}`,
      }));

    case 'Form':
      return listElement.Form.map((x) => ({
        key: `key-${x.struct_type}-${x.func_type}`,
        name: x.name,
        value: { structType: x.struct_type, funcType: x.func_type },
        label: `${x.struct_type}`,
      }));

    case 'Other':
      return listElement.Other.map((x, idx) => ({
        key: `key-${x.struct_type}-${x.func_type}-${idx}`,
        name: x.name,
        value: { structType: x.struct_type, funcType: x.func_type },
        label: `${x.struct_type}`,
      }));

    case 'Widget':
      return listElement.Widget.map((libraryElement, idx) => {
        const { struct_type, func_type, name = 'widget' } = libraryElement;
        return {
          key: `key-${struct_type}-${func_type}-${idx}`,
          name: libraryElement.name,
          value: { structType: struct_type, funcType: func_type },
          label: name,
        };
      });

    case 'Image':
      return listElement.Image.map((x) => ({
        key: `key-${x.struct_type}-${x.func_type}`,
        name: x.name,
        value: { structType: x.struct_type, funcType: x.func_type },
        label: `${x.struct_type}`,
      }));
    case 'Custom':
      return listElement.Custom.map((libraryElement, idx) => {
        const { struct_type, func_type, name = 'section' } = libraryElement;
        return {
          key: `key-${struct_type}-${func_type}-${idx}`,
          name: libraryElement.name,
          value: { structType: struct_type, funcType: func_type },
          label: name,
          custom: true,
        };
      });
    default:
      return [];
  }
};

export const getChooseElements = (
  element: CreatedElement,
  chooseElements: CreatedElement[],
): CreatedElement[] => {
  return chooseElements.some((x) => x.type === element.type)
    ? chooseElements.filter((x) => x.type !== element.type)
    : [...chooseElements, element];
};

export const getCheckedElements = (listElements: ITemplateElement[]) =>
  listElements.reduce(
    (acc: CreatedElement[], x) =>
      x.checked
        ? acc.concat({
            type: x.value.structType,
            name: x.name,
            custom: x.custom || false,
          })
        : acc,
    [],
  );

export const scenarioItemToLS = ({
  id,
  struct_type,
  parameters: { children },
}: IScenarioItem): ILSItem => ({
  id,
  type: struct_type,
  children: children || [],
});

export const elementToLS = ({
  id,
  struct_type,
}: IScenarioElement): ILSItem => ({
  id,
  type: struct_type,
  children: [],
});
