import { RecursiveElement } from '@Src/types';

// eslint-disable-next-line import/prefer-default-export
export const convertToRecursiveServerElement = (
  recursiveElement: RecursiveElement,
) => ({
  id: parseInt(recursiveElement.id),
  name: recursiveElement.name,
  children: recursiveElement.children.map((childId) => parseInt(childId)),
});
