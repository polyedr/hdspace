import { mockRoot } from './mocks';
import { LibraryElement } from '../../api/types';
import { removeChildrenFromElement } from '../ElementsTreeHelper';

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
    const removedChild = { ...mockParams, id: '2', children: [], buoyancy: 0 };
    const updatedTree = removeChildrenFromElement(
      '1',
      [removedChild],
      mockRoot,
    );

    expect(updatedTree).toMatchSnapshot();
  });

  test('Should remove child from parent on 2 level', () => {
    const removedChild = { ...mockParams, id: '4', children: [], buoyancy: 1 };
    const updatedTree = removeChildrenFromElement(
      '2',
      [removedChild],
      mockRoot,
    );

    expect(updatedTree).toMatchSnapshot();
  });

  test('Should return correct buoyancy', () => {
    const removedChild = { ...mockParams, id: '3', children: [], buoyancy: 0 };
    const updatedTree = removeChildrenFromElement(
      '2',
      [removedChild],
      mockRoot,
    );

    expect(updatedTree).toMatchSnapshot();
  });

  test('Should remove child from parent on 3 level', () => {
    const removedChild = { ...mockParams, id: '5', children: [], buoyancy: 1 };
    const updatedTree = removeChildrenFromElement(
      '4',
      [removedChild],
      mockRoot,
    );

    expect(updatedTree).toMatchSnapshot();
  });
});
