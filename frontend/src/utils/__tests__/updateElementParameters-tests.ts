import { updateElementParameters } from '$utils/ElementsTreeHelper';

import { mockRoot } from './mocks';

describe('updateElementParameters', () => {
  test('Should update element parameters on 1 level', () => {
    const updatedTree = updateElementParameters('1', { value: '123', name: '456' }, mockRoot);

    expect(updatedTree).toMatchSnapshot();
  });

  test('Should update element parameters on 2 level', () => {
    const updatedTree = updateElementParameters('2', { value: '123', name: '456' }, mockRoot);

    expect(updatedTree).toMatchSnapshot();
  });

  test('Should update element parameters on 3 level', () => {
    const updatedTree = updateElementParameters('3', { value: '123', name: '456' }, mockRoot);

    expect(updatedTree).toMatchSnapshot();
  });

  test('Should update element parameters on 5 level', () => {
    const updatedTree = updateElementParameters('5', { value: '123', name: '456' }, mockRoot);

    expect(updatedTree).toMatchSnapshot();
  });
});
