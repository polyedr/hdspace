import { mockRoot } from './mocks';
import { findParentByChildID } from '../ElementsTreeHelper';

describe('findParentByChildID', () => {
  test('Should find parent of elementId on 2 level', () => {
    const updatedTree = findParentByChildID(mockRoot, '2');

    expect(updatedTree).toMatchSnapshot();
  });

  test('Should find parent of elementId on 3 level', () => {
    const updatedTree = findParentByChildID(mockRoot, '4');

    expect(updatedTree).toMatchSnapshot();
  });

  test('Should find parent of elementId on 4 level', () => {
    const updatedTree = findParentByChildID(mockRoot, '6');

    expect(updatedTree).toMatchSnapshot();
  });
});
