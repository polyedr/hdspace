import { mockRoot } from './mocks';
import { findChildByID } from '../ElementsTreeHelper';

describe('findChildByID', () => {
  test('Should find child to element on 1 level', () => {
    const updatedTree = findChildByID(mockRoot, '1');

    expect(updatedTree).toMatchSnapshot();
  });

  test('Should find child to element on 2 level', () => {
    const updatedTree = findChildByID(mockRoot, '2');

    expect(updatedTree).toMatchSnapshot();
  });

  test('Should find child to element on 3 level', () => {
    const updatedTree = findChildByID(mockRoot, '4');

    expect(updatedTree).toMatchSnapshot();
  });

  test('Should find child to element on 4 level', () => {
    const updatedTree = findChildByID(mockRoot, '5');

    expect(updatedTree).toMatchSnapshot();
  });
});
