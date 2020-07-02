import { removeChildrenFromElement } from '$utils/ElementsTreeHelper';

import { mockRoot } from './mocks';
import { Entity } from '$domain/core';

describe('removeChildrenFromElement', () => {
  const mockParams = {
    name: 'heading',
    type: 'heading' as Entity,
    image: null,
    parameters: {},
    styles: {},
  };

  test('Should remove child from parent on 1 level', () => {
    const removedChild = { id: '2', children: [], buoyancy: 0, ...mockParams };
    const updatedTree = removeChildrenFromElement('1', [removedChild] , mockRoot);

    expect(updatedTree).toMatchSnapshot();
  });

  test('Should remove child from parent on 2 level', () => {
    const removedChild = { id: '4', children: [], buoyancy: 1, ...mockParams };
    const updatedTree = removeChildrenFromElement('2', [removedChild] , mockRoot);

    expect(updatedTree).toMatchSnapshot();
  });

  test('Should return correct buoyancy', () => {
    const removedChild = { id: '3', children: [], buoyancy: 0, ...mockParams };
    const updatedTree = removeChildrenFromElement('2', [removedChild] , mockRoot);

    expect(updatedTree).toMatchSnapshot();
  });

  test('Should remove child from parent on 3 level', () => {
    const removedChild = { id: '5', children: [], buoyancy: 1, ...mockParams };
    const updatedTree = removeChildrenFromElement('4', [removedChild] , mockRoot);

    expect(updatedTree).toMatchSnapshot();
  });
});
