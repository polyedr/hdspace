import { removeElementStyles } from '$utils/ElementsTreeHelper';

import { mockRootWithStyles as mockRoot } from './mocks';

describe('removeElementStyles', () => {
  test('Should remove element styles on 1 level', () => {
    const updatedTree = removeElementStyles('1', ['color'], mockRoot);

    expect(updatedTree).toMatchSnapshot();
  });

  test('Should remove element styles on 2 level', () => {
    const updatedTree = removeElementStyles('2', ['color'], mockRoot);

    expect(updatedTree).toMatchSnapshot();
  });

  test('Should remove element styles on 3 level', () => {
    const updatedTree = removeElementStyles('3', ['color'], mockRoot);

    expect(updatedTree).toMatchSnapshot();
  });

  test('Should remove element styles on 5 level', () => {
    const updatedTree = removeElementStyles('5', ['color'], mockRoot);

    expect(updatedTree).toMatchSnapshot();
  });
});
