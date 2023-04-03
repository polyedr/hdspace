import { keys } from 'ramda';
import * as Icons from '@mui/icons-material';
import { ICONS } from '@Domain/libraryElements/libraryElements';
import {
  ElementData,
  ElementEntity,
  ElementsHierarchy,
  ElementsToAdd,
  IconServerElement,
  ServerElement,
} from '../types';

export const createIconsList = (makeIcon: {
  (): IconServerElement;
  (arg0: string, arg1: string): any;
}): ElementData[] => {
  return Object.entries(Icons)
    .splice(0, 5)
    .map((item) => {
      const [name, icon] = item;

      const element = makeIcon(name, name);

      return {
        id: element.id.toString(),
        key: element.parameters.name,
        type: element.struct_type,
        icon,
        name: element.parameters.name,
        custom: false,
        parameters: element.parameters,
      };
    });
};

export const convertElementToData = (
  element: ServerElement<any>,
  isCustom: boolean = false,
): ElementData => ({
  id: element.id.toString(),
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
    case 'nativeColumns':
    case 'columns':
    case 'grid':
    case 'section':
      return {
        elements: {
          ...obj.elements,
          layout: {
            ...(obj.elements?.layout || {}),
            [structType]: convertElementToData(libraryElements[structType]()),
          },
        },
      };
    case 'list':
    case 'container':
    case 'paragraph':
    case 'heading':
    case 'image':
    case 'imagesList':
    case 'video':
    case 'textBlock':
    case 'html':
    case 'breadcrumb':
    case 'pagination':
    case 'carousel':
    case 'navbar':
      return {
        elements: {
          ...obj.elements,
          basic: {
            ...(obj.elements?.basic || {}),
            [structType]: convertElementToData(libraryElements[structType]()),
          },
        },
      };
    case 'button':
    case 'textinput':
    case 'textarea':
    case 'slider':
    case 'dateTimePicker':
    case 'checkbox':
    case 'switch':
    case 'radiobuttonGroup':
    case 'label':
    case 'buttonGenerator':
    case 'select':
      return {
        elements: {
          ...obj.elements,
          form: {
            ...(obj.elements?.form || {}),
            [structType]: convertElementToData(libraryElements[structType]()),
          },
        },
      };
    case 'icon': {
      return {
        elements: {
          ...(obj.elements || {}),
          icon: createIconsList(libraryElements[structType]),
        },
      };
    }
    case 'map':
    case 'calendar':
    case 'clock':
      return {
        elements: {
          ...obj.elements,
          widget: {
            ...(obj.elements?.widget || {}),
            [structType]: convertElementToData(libraryElements[structType]()),
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
            [structType]: convertElementToData(libraryElements[structType]()),
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
            convertElementToData(libraryElements[structType]()),
          ],
        },
      };
    case 'smartHeader':
    case 'smartFooter':
    case 'smartForm':
    case 'smartWebpage':
      return {
        templates: {
          ...(obj.templates || {}),
          [structType]: convertElementToData(libraryElements[structType]()),
        },
      };
    case 'divBlock':
    case 'ocrtext':
    case 'dropdown':
    case 'root':
    default:
      return null;
  }
};

export const createElementsHierarchy = (
  libraryElements: ElementsToAdd,
): ElementsHierarchy =>
  // @ts-expect-error
  keys(libraryElements).reduce<ElementsHierarchy>(
    (acc, structType) => ({
      ...acc,
      ...getRightPanelCategoryTabs(structType, libraryElements, acc),
    }),
    // @ts-expect-error
    {},
  );
