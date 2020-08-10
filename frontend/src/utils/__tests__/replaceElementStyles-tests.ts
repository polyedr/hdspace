import { replaceElementStyles } from '$utils/ElementsTreeHelper';

import { mockRootWithStyles as mockRoot } from './mocks';

describe('replaceElementStyles', () => {
  test('Should replace element styles on 1 level', () => {
    const updatedTree = replaceElementStyles('1', { color: 'red' }, mockRoot);

    expect(updatedTree).toMatchSnapshot();
  });

  test('Should replace element styles on 2 level', () => {
    const updatedTree = replaceElementStyles('2', { color: 'red' }, mockRoot);

    expect(updatedTree).toMatchSnapshot();
  });

  test('Should replace element styles on 3 level', () => {
    const updatedTree = replaceElementStyles('3', { color: 'red' }, mockRoot);

    expect(updatedTree).toMatchSnapshot();
  });

  test('Should replace element styles on 5 level', () => {
    const updatedTree = replaceElementStyles('5', { color: 'red' }, mockRoot);

    expect(updatedTree).toMatchSnapshot();
  });
});
