import { ServerElement, LibraryElement } from '$api/types';
import { LIBRARY_ELEMENTS } from '$domain/libraryElements/libraryElements';
import { getConfigurablePropsOf, Entity } from '$domain/core';

export const convertCreatedElementToRequest = <T extends Entity, K extends ServerElement<T>['parameters']>(
  elementType: T,
  parentID: string | null,
  elementName?: string
): ServerElement<T, ServerElement<Entity>[], K> => {
  const libraryElement = LIBRARY_ELEMENTS[elementType];
  const { styles, params } = getConfigurablePropsOf<Entity, K>('root')(libraryElement.struct_type);
  const { name, children } = libraryElement;

  const getChildrenWithConfigurableProps = <P extends Entity, R extends Entity, S extends ServerElement<T>['parameters']>(
    children: ServerElement<P, ServerElement<R, [], {}>[], {}>[]
  ): ServerElement<P, ServerElement<R>[], S>[] =>
    children.map((child) => {
      const { styles, params } = getConfigurablePropsOf<Entity, S>('root')(
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

export const convertElementToRequest = <T extends Entity, K extends Entity, P extends ServerElement<T>['parameters']>(
  element: LibraryElement<T, LibraryElement<K>[], P>
): ServerElement<T, ServerElement<K>[], P> => {
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

export const convertElementToPatchRequest = <T extends Entity, K extends Entity, P extends ServerElement<T>['parameters']>(
  element: LibraryElement<T, LibraryElement<K>[], P>
): ServerElement<T, ServerElement<K>[], P> => {
  const { id, name, type, buoyancy, image, parameters, styles } = element;

  return {
    id: Number(id),
    name,
    children: [],
    struct_type: type,
    func_type: type,
    buoyancy,
    image: null,
    parameters,
    styles,
  };
};
