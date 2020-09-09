import { mockRoot } from './mocks';
import { updateElementStyles } from '../ElementsTreeHelper';

describe('updateElementStyles', () => {
  test('Should update elementId styles on 1 level', () => {
    const updatedTree = updateElementStyles('1', { color: 'red' }, mockRoot);

    expect(updatedTree).toMatchSnapshot();
  });

  test('Should update elementId styles on 2 level', () => {
    const updatedTree = updateElementStyles('2', { color: 'red' }, mockRoot);

    expect(updatedTree).toMatchSnapshot();
  });

  test('Should update elementId styles on 3 level', () => {
    const updatedTree = updateElementStyles('3', { color: 'red' }, mockRoot);

    expect(updatedTree).toMatchSnapshot();
  });

  test('Should update elementId styles on 5 level', () => {
    const updatedTree = updateElementStyles('5', { color: 'red' }, mockRoot);

    expect(updatedTree).toMatchSnapshot();
  });
});
