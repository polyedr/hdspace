import { removeChildrenFromElement } from '$utils/ElementsTreeHelper';
import { LibraryElement } from '$api/types';

import { mockRoot } from './mocks';

describe('removeChildrenFromElement', () => {
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
