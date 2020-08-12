import { replaceChild } from '$utils/ElementsTreeHelper';
import { LibraryElement } from '$api/types';

import { mockRoot } from './mocks';

describe('replaceChild', () => {
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

  test('Should replace child on 1 level', () => {
    const newChild = { id: '7', children: [], buoyancy: 0, ...mockParams };
    const updatedTree = replaceChild('1', newChild , mockRoot);

    expect(updatedTree).toMatchSnapshot();
  });

  test('Should replace child on 2 level', () => {
    const newChild = { id: '8', children: [], buoyancy: 0, ...mockParams };
    const updatedTree = replaceChild('2', newChild , mockRoot);

    expect(updatedTree).toMatchSnapshot();
  });

  test('Should replace child on 3 level', () => {
    const newChild = { id: '9', children: [], buoyancy: 1, ...mockParams };
    const updatedTree = replaceChild('4', newChild , mockRoot);

    expect(updatedTree).toMatchSnapshot();
  });
});
