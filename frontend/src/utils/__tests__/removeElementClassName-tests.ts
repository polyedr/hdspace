import { mockRootWithStyles as mockRoot } from './mocks';
import { removeElementClassName } from '../ElementsTreeHelper';

describe('removeElementClassName', () => {
  test('Should remove elementId className on 1 level', () => {
    const updatedTree = removeElementClassName('1', 'heading', mockRoot);

    expect(updatedTree).toMatchSnapshot();
  });

  test('Should remove elementId className on 2 level', () => {
    const updatedTree = removeElementClassName('2', 'heading', mockRoot);

    expect(updatedTree).toMatchSnapshot();
  });

  test('Should remove elementId className on 3 level', () => {
    const updatedTree = removeElementClassName('3', 'heading', mockRoot);

    expect(updatedTree).toMatchSnapshot();
  });

  test('Should remove elementId className on 5 level', () => {
    const updatedTree = removeElementClassName('5', 'heading', mockRoot);

    expect(updatedTree).toMatchSnapshot();
  });
});
