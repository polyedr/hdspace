
import { mockRoot } from './mocks';
import { replaceChild } from '../ElementsTreeHelper';
import { LibraryElement } from '../../api/types';

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
    const newChild = { ...mockParams, id: '7', children: [], buoyancy: 0 };
    const updatedTree = replaceChild('1', newChild , mockRoot);

    expect(updatedTree).toMatchSnapshot();
  });

  test('Should replace child on 2 level', () => {
    const newChild = { ...mockParams, id: '8', children: [], buoyancy: 0 };
    const updatedTree = replaceChild('2', newChild , mockRoot);

    expect(updatedTree).toMatchSnapshot();
  });

  test('Should replace child on 3 level', () => {
    const newChild = { ...mockParams, id: '9', children: [], buoyancy: 1 };
    const updatedTree = replaceChild('4', newChild , mockRoot);

    expect(updatedTree).toMatchSnapshot();
  });
});
