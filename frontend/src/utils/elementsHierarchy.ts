import * as R from 'ramda';
import { ICONS } from '@Domain/libraryElements/libraryElements';
import {
  ElementData,
  ElementEntity,
  ElementsHierarchy,
  ElementsToAdd,
  ServerElement,
} from '../types';

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
    case 'nativeColumns':
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
    case 'smartHeader':
    case 'smartFooter':
    case 'smartForm':
    case 'smartWebpage':
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
