import { ServerElement, LibraryElement, ServerRecursiveElement, RecursiveElement } from '$api/types';


export const convertElementFromResponse = (element: ServerElement): LibraryElement => {
  const { id, name, children, struct_type, buoyancy, image, parameters, styles } = element;

  return {
    id: String(id),
    name,
    children: (children as ServerElement[])
      .map((child) => convertElementFromResponse(child))
      .sort((firstChild, secondChild) => firstChild.buoyancy - secondChild.buoyancy),
    type: struct_type,
    buoyancy,
    image,
    parameters,
    styles,
  } as LibraryElement;
};

export const convertRecursiveElementFromResponse = (element: ServerRecursiveElement): RecursiveElement => {
  const { id, name, children } = element;

  return {
    id: String(id),
    name,
    children,
  };
};
