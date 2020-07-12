import { addChildToElement } from '$utils/ElementsTreeHelper';
import { Entity } from '$domain/core';

import { mockRoot } from './mocks';

describe('addChildToElement', () => {
  const mockParams = {
    name: 'heading',
    type: 'heading' as Entity,
    image: null,
    parameters: {},
    styles: {},
  };

  test('Should add child to element on 1 level', () => {
    const newChild = { id: '7', children: [], buoyancy: 0, ...mockParams };
    const updatedTree = addChildToElement('1', newChild , mockRoot, 0);

    expect(updatedTree).toMatchSnapshot();
  });

  test('Should add new child to element on 2 level', () => {
    const newChild = { id: '8', children: [], buoyancy: 0, ...mockParams };
    const updatedTree = addChildToElement('2', newChild , mockRoot, 1);

    expect(updatedTree).toMatchSnapshot();
  });

  test('Should add new child to element on 3 level', () => {
    const newChild = { id: '9', children: [], buoyancy: 0, ...mockParams };
    const updatedTree = addChildToElement('4', newChild , mockRoot, 2);

    expect(updatedTree).toMatchSnapshot();
  });
});
