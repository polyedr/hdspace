
import { mockRootWithStyles as mockRoot } from './mocks';
import { addElementClassName } from '../ElementsTreeHelper';

describe('addElementClassName', () => {
  test('Should add element className on 1 level', () => {
    const updatedTree = addElementClassName('1', 'heading-group', mockRoot);

    expect(updatedTree).toMatchSnapshot();
  });

  test('Should add element className on 2 level', () => {
    const updatedTree = addElementClassName('2', 'heading-group', mockRoot);

    expect(updatedTree).toMatchSnapshot();
  });

  test('Should add element className on 3 level', () => {
    const updatedTree = addElementClassName('3', 'heading-group', mockRoot);

    expect(updatedTree).toMatchSnapshot();
  });

  test('Should add element className on 5 level', () => {
    const updatedTree = addElementClassName('5', 'heading-group', mockRoot);

    expect(updatedTree).toMatchSnapshot();
  });
});
