import { mockRoot } from './mocks';
import { LibraryElement } from '../../api/types';
import { addChildrenToElement } from '../ElementsTreeHelper';

describe('addChildrenToElement', () => {
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

  test('Should add child to elementId on 1 level', () => {
    const newChild = { ...mockParams, id: '7', children: [], buoyancy: 0 };
    const updatedTree = addChildrenToElement('1', [newChild], mockRoot);

    expect(updatedTree).toMatchSnapshot();
  });

  test('Should add new child to elementId on 2 level', () => {
    const newChild = { ...mockParams, id: '8', children: [], buoyancy: 0 };
    const updatedTree = addChildrenToElement('2', [newChild], mockRoot);

    expect(updatedTree).toMatchSnapshot();
  });

  test('Should add new child to elementId on 3 level', () => {
    const newChild = { ...mockParams, id: '9', children: [], buoyancy: 0 };
    const updatedTree = addChildrenToElement('4', [newChild], mockRoot);

    expect(updatedTree).toMatchSnapshot();
  });
});
