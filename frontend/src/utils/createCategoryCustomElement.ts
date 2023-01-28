import { ElementData, Entity, LibraryElement } from '@Src/types';

export const createCategoryCustomElement = (nameElement: string) => {
  if (
    nameElement.includes('Header') ||
    nameElement.includes('Main') ||
    nameElement.includes('Footer')
  )
    return 'Big blocks';

  if (
    nameElement.includes('Form') ||
    nameElement.includes('Nav') ||
    nameElement.includes('Section') ||
    nameElement.includes('Article') ||
    nameElement.includes('Card Group') ||
    nameElement.includes('Aside')
  )
    return 'Medium blocks';

  if (nameElement.includes('Alert') || nameElement.includes('Card'))
    return 'Small blocks';

  if (nameElement.includes('Button') || nameElement.includes('Input'))
    return 'HTML elements';

  return 'Other elements';
};

export const splitCategory = (array: ElementData[]) => ({
  bigBlocks: array.filter((item) => item.category === 'Big blocks'),
  mediumBlocks: array.filter((item) => item.category === 'Medium blocks'),
  smallBlocks: array.filter((item) => item.category === 'Small blocks'),
  htmlElements: array.filter((item) => item.category === 'HTML elements'),
  otherElements: array.filter((item) => item.category === 'Other elements'),
});

export const createArrayCustomElements = (
  libraryElements: Array<LibraryElement<Entity>>,
) => {
  const elements: ElementData[] = libraryElements.map((element) => ({
    key: `custom-element-${element.id}`,
    id: element.id,
    type: element.type,
    name: element.name,
    custom: true,
    icon: undefined,
    category: createCategoryCustomElement(element.name),
  }));
  return splitCategory(elements);
};
