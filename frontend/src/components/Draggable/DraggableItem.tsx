import React from 'react';
import { LibraryElementUnion } from 'src/api/types';
import useElementProps from '../Editor/hooks/useElementProps';
import { RENDERERS } from '../UI/RenderElements';
// import ItemType from './ItemTypes';

type DraggableItemProps = {
  item: LibraryElementUnion;
};
const DraggableItem: React.FC<DraggableItemProps> = ({ item }) => {
  const elementProps = useElementProps(item);
  /* const [, drag] = useDrag({
    item: {
      original: item,
      type: ItemType.ELEMENT,
    },
  }); */
  const ElementRenderer = RENDERERS[item.type];

  return (
    elementProps && (
      <ElementRenderer {...elementProps}>
        {(item.children as LibraryElementUnion[])?.map((child) => (
          <DraggableItem key={`item-${child.id}`} item={child} />
        ))}
      </ElementRenderer>
    )
  );
};

export default DraggableItem;
