import { ServerElement, LibraryElement } from '$api/types';
import { LIBRARY_ELEMENTS } from '$domain/libraryElements/libraryElements';
import { getConfigurablePropsOf, Entity } from '$domain/core';

export const convertCreatedElementToRequest = <T extends Entity>(
  elementType: T,
  parentID: string | null,
  elementName?: string
): ServerElement<T, ServerElement<Entity>[]> => {
  const libraryElement = LIBRARY_ELEMENTS[elementType];
  const { styles, params } = getConfigurablePropsOf('root')(libraryElement.struct_type);
  const { name, children } = libraryElement;

  const getChildrenWithConfigurableProps = <K extends Entity, P extends Entity>(
    children: ServerElement<K, ServerElement<P, [], {}>[], {}>[]
  ): ServerElement<K, ServerElement<P>[], {}>[] =>
    children.map((child) => {
      const { styles, params } = getConfigurablePropsOf('root')(
        child.struct_type
      );
      return {
        ...child,
        styles: { ...child.styles, ...styles },
        parameters: { ...child.parameters, ...params },
        children: getChildrenWithConfigurableProps(child.children),
      };
    });

  return {
    id: -1,
    name: elementName || name,
    children: getChildrenWithConfigurableProps(children),
    ...(parentID && { scenario: parseInt(parentID) }),
    struct_type: elementType,
    func_type: elementType,
    buoyancy: 0,
    image: null,
    parameters: params,
    styles,
  };
};

export const convertElementToRequest = <T extends Entity, K extends Entity>(
  element: LibraryElement<T, LibraryElement<K>[]>
): ServerElement<T, ServerElement<K>[]> => {
  const { id, name, children, type, buoyancy, image, parameters, styles } = element;

  return {
    id: Number(id),
    name,
    children: children.map((child) => convertElementToRequest(child)),
    struct_type: type,
    func_type: type,
    buoyancy,
    image,
    parameters,
    styles,
  };
};

export const convertElementToPatchRequest = <T extends Entity, K extends Entity>(
  element: LibraryElement<T, LibraryElement<K>[]>
): ServerElement<T, ServerElement<K>[]> => {
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
  };
};
