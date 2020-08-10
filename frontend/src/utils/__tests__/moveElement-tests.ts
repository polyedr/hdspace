import { moveElement } from '$utils/ElementsTreeHelper';
import { LibraryElement } from '$api/types';

import { mockRoot } from './mocks';

describe('moveElement', () => {
  const mockParams = {
    name: 'heading',
    type: 'heading',
    image: null,
    parameters: {},
    styles: {
      classNames: ['heading'],
      ownStyles: {},
    },
  } as LibraryElement<'heading'>;

  test('Should remove child from 3 level and add on 4 level', () => {
    const movedElement = { id: '3', children: [], buoyancy: 0, ...mockParams };
    const updatedTree = moveElement('4', movedElement, mockRoot, 2);

    expect(updatedTree).toMatchSnapshot();
  });

  test('Should remove child from 4 level and add on 2 level', () => {
    const movedElement = { id: '5', children: [], buoyancy: 0, ...mockParams };
    const updatedTree = moveElement('1', movedElement, mockRoot, 0);

    expect(updatedTree).toMatchSnapshot();
  });

  test('Should remove child from 3 level and add on 2 level', () => {
    const movedElement = {
      id: '4',
      children: [
        {
          id: '5',
          buoyancy: 0,
          ...mockParams,
          children: [],
        },
        {
          id: '6',
          buoyancy: 1,
          ...mockParams,
          children: [],
        },
      ],
      buoyancy: 0,
      ...mockParams,
    };

    const updatedTree = moveElement('1', movedElement, mockRoot, 1);

    expect(updatedTree).toMatchSnapshot();
  });

  test('If element not exist in tree, just add new element to parent', () => {
    const newElement = { id: '7', children: [], buoyancy: 0, ...mockParams };
    const updatedTree = moveElement('2', newElement, mockRoot, 1);

    expect(updatedTree).toMatchSnapshot();
  });
});
