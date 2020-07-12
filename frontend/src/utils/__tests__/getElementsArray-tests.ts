import { getElementsArray } from '$utils/ElementsTreeHelper';

import { mockRoot } from './mocks';

describe('getElementsArray', () => {
  test('Should add all elements in array', () => {
    const elementsArray = getElementsArray(mockRoot);

    expect(elementsArray).toMatchSnapshot();
  });
});
