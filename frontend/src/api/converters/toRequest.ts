import { ServerElement, LibraryElement } from '$api/types';
import { LIBRARY_ELEMENTS } from '$domain/libraryElements';
import { getConfigurablePropsOf, Entity } from '$domain/core';

export const convertCreatedElementToRequest = (elementType: Entity, parentID: string | null, elementName?: string): ServerElement => {
  const libraryElement = LIBRARY_ELEMENTS[elementType as keyof typeof LIBRARY_ELEMENTS];
  const { styles, params } = getConfigurablePropsOf('root')(libraryElement.struct_type);
  const { name, children } = libraryElement;

  const getChildrenWithConfigurableProps = (children: ServerElement[]): ServerElement[] => children.map(child => {
    const { styles, params } = getConfigurablePropsOf('root')(child.struct_type);
    return {
      ...child,
      styles: { ...child.styles, ...styles },
      parameters: { ...child.parameters, ...params },
      children: getChildrenWithConfigurableProps(child.children as ServerElement[]),
    } as ServerElement
  })

  return {
    id: -1,
    name: elementName || name,
    children: getChildrenWithConfigurableProps(children as ServerElement[]),
    ...(parentID && { scenario: parseInt(parentID) }),
    struct_type: elementType,
    func_type: elementType,
    buoyancy: 0,
    image: null,
    parameters: params,
    styles,
  } as ServerElement;
};


export const convertElementToRequest = (element: LibraryElement): ServerElement => {
  const { id, name, children, type, buoyancy, image, parameters, styles } = element;

  return {
    id: Number(id),
    name,
    children: (children as LibraryElement[]).map(child => convertElementToRequest(child)),
    struct_type: type,
    func_type: type,
    buoyancy,
    image,
    parameters,
    styles,
  } as ServerElement;
};

export const convertElementToPatchRequest = (element: LibraryElement): ServerElement => {
  const { id, name, type, buoyancy, image, parameters, styles } = element;

  return {
    id: Number(id),
    name,
    children: [],
    struct_type: type,
    func_type: type,
    buoyancy,
    image,
    parameters,
    styles,
  } as ServerElement;
};
