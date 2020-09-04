import { mockRoot } from './mocks';
import { getElementsArray } from '../ElementsTreeHelper';

describe('getElementsArray', () => {
  test('Should add all elements in array', () => {
    const elementsArray = getElementsArray(mockRoot);

    expect(elementsArray).toMatchSnapshot();
  });
});
