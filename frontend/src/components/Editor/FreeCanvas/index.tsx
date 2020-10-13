import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDrop, XYCoord } from 'react-dnd';
import {
  selectCurrentRootId,
  selectElementsForCurrentScreen,
} from '../../../redux/project/selectors';
import FreeDraggable from './FreeDraggable';
import { StateElement } from '../../../redux/project/types';
import { Normalized } from '../../../api/types';

type FreeElement = StateElement & {
  top: number;
  left: number;
};

const transformElements = (
  elements: Normalized<StateElement>,
  rootId: string,
): Normalized<FreeElement> =>
  Object.values(elements).reduce((acc, curr) => {
    if (curr.id !== rootId) {
      acc[curr.id] = {
        ...curr,
        top: 0,
        left: 0,
      };
    }
    return acc;
  }, {});

const FreeCanvas: React.FC = () => {
  const currentRootId = useSelector(selectCurrentRootId);
  const elements = useSelector(selectElementsForCurrentScreen);

  const [items, setItems] = useState<Normalized<FreeElement>>({});

  useEffect(() => {
    setItems(transformElements(elements, currentRootId));
  }, [elements, currentRootId]);

  const moveBox = (id: string, left: number, top: number) => {
    setItems({
      ...items,
      [id]: {
        ...items[id],
        left,
        top,
      },
    });
  };

  const [, drop] = useDrop({
    accept: ['element', 'constructor'],
    drop(item: any, monitor) {
      const delta = monitor.getDifferenceFromInitialOffset() as XYCoord;
      const left = Math.round(item.left + delta.x);
      const top = Math.round(item.top + delta.y);
      moveBox(item.id, left, top);
      return undefined;
    },
  });

  return (
    <div
      ref={drop}
      style={{
        height: '100%',
        position: 'relative',
      }}
    >
      {Object.keys(items).map((key) => {
        const { left, top, name } = items[key];
        return (
          <FreeDraggable key={key} id={key} left={left} top={top}>
            {name}
          </FreeDraggable>
        );
      })}
    </div>
  );
};

export default FreeCanvas;
