import { ServerRecursiveElement, RecursiveElement, ServerElement, LibraryElement } from '$api/types';
import { Entity } from '$domain/core';

export const convertElementFromResponse = <T extends Entity, K extends Entity>(
  element: ServerElement<T, ServerElement<K>[]>
): LibraryElement<T, LibraryElement<K>[]> => {
  const { id, name, children, struct_type, buoyancy, image, parameters, styles } = element;

  return {
    id: String(id),
    name,
    children: children
      .map((child) => convertElementFromResponse(child))
      .sort(
        (firstChild, secondChild) => firstChild.buoyancy - secondChild.buoyancy
      ),
    type: struct_type,
    buoyancy,
    image,
    parameters,
    styles,
  };
};

export const convertRecursiveElementFromResponse = (element: ServerRecursiveElement): RecursiveElement => {
  const { id, name, children } = element;

  return {
    id: String(id),
    name,
    children,
  };
};
