import { mockRootWithStyles as mockRoot } from './mocks';
import { removeElementStyles } from '../ElementsTreeHelper';

describe('removeElementStyles', () => {
  test('Should remove elementId styles on 1 level', () => {
    const updatedTree = removeElementStyles('1', ['color'], mockRoot);

    expect(updatedTree).toMatchSnapshot();
  });

  test('Should remove elementId styles on 2 level', () => {
    const updatedTree = removeElementStyles('2', ['color'], mockRoot);

    expect(updatedTree).toMatchSnapshot();
  });

  test('Should remove elementId styles on 3 level', () => {
    const updatedTree = removeElementStyles('3', ['color'], mockRoot);

    expect(updatedTree).toMatchSnapshot();
  });

  test('Should remove elementId styles on 5 level', () => {
    const updatedTree = removeElementStyles('5', ['color'], mockRoot);

    expect(updatedTree).toMatchSnapshot();
  });
});
