import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Rnd, RndResizeCallback } from 'react-rnd';
import { DropTargetMonitor, useDrop } from 'react-dnd';
import cn from 'classnames';
import {
  selectActiveElementId,
  selectCurrentRoot,
  selectCurrentScreenId,
  selectDirectRootChildren,
} from '../../../redux/project/selectors';
import {
  setActiveElement,
  updateElementParameters,
  createElements,
} from '../../../redux/project/actions';
import FREE_CANVAS_RENDERERS from './FreeRenderers';
import { useElementClassNames } from './helpers';
import {
  ElementData,
  Normalized,
  StateElement,
  SyntheticElement,
} from '../../../types';

import { ElementType } from '../../../constants/dragAndDrop';

const FreeCanvas = () => {
  const dispatch = useDispatch();

  const ref = useRef<Rnd | null>(null);

  const root = useSelector(selectCurrentRoot);
  const directChildren: Normalized<StateElement> = useSelector(
    selectDirectRootChildren,
  );
  const activeElementId = useSelector(selectActiveElementId);
  const currentScreenId = useSelector(selectCurrentScreenId);

  const { entityStyles, groupStyles, ownStyles } = useElementClassNames(root);

  const rootSize = () =>
    Object.values(directChildren).reduce(
      (acc, curr) => {
        const width = curr.parameters.left + curr.parameters.width || 0;
        const height = curr.parameters.top + curr.parameters.height || 0;
        return {
          width: Math.max(width, acc.width, root.parameters.width),
          height: Math.max(height, acc.height, root.parameters.height),
        };
      },
      { width: root.parameters.width, height: root.parameters.height },
    );

  const handleResize: RndResizeCallback = (e, dir, rnd, delta) => {
    if (dir !== 'bottom') return;

    ref.current?.updateSize({
      height: ref.current.resizable.size.height + delta.height,
      width: ref.current.resizable.size.width,
    });
  };

  const handleResizeStop: RndResizeCallback = (e, dir, rnd, delta) => {
    if (!ref.current?.resizable) return;

    dispatch(
      updateElementParameters(
        root.id,
        {
          height: ref.current.resizable.size.height + delta.height,
        },
        { screenId: currentScreenId },
      ),
    );
  };

  const [, drop] = useDrop({
    accept: [ElementType.CONSTRUCTOR],
    drop: (
      dragSource: SyntheticElement<StateElement | ElementData>,
      monitor: DropTargetMonitor,
    ) => {
      const offset = monitor.getClientOffset();
      if (!ref.current || !ref.current.resizableElement || !offset) {
        return;
      }
      const { resizableElement } = ref.current;
      const { id, type, name, custom } = dragSource.original as ElementData;

      const rect = (resizableElement.current as HTMLElement).getBoundingClientRect();

      dispatch(
        createElements(
          [
            {
              id,
              type,
              name,
              custom,
              parameters: {
                top: offset.y - rect.y,
                left: offset.x - rect.x,
              },
            },
          ],
          { screenId: currentScreenId },
          root.id,
        ),
      );
    },
  });

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const { resizableElement } = ref.current;
    drop(resizableElement);
  }, [drop]);

  return (
    <Rnd
      ref={(c) => {
        ref.current = c;
      }}
      className={cn(entityStyles, groupStyles, ownStyles)}
      style={{
        position: 'relative',
        userSelect: 'none',
        display: 'block',
        border: `1px solid ${
          activeElementId === root.id ? '#5A899D' : 'transparent'
        }`,
      }}
      onClick={() => dispatch(setActiveElement(root.id))}
      enableResizing={false}
      disableDragging
      minWidth="100%"
      minHeight="100%"
      onResize={handleResize}
      onResizeStop={handleResizeStop}
      size={rootSize()}
    >
      {Object.values(directChildren).map((element) => {
        const Renderer = FREE_CANVAS_RENDERERS[element.type];
        if (!Renderer) return null;

        return (
          <Renderer
            key={element.id}
            element={element}
            isActive={element.id === activeElementId}
          />
        );
      })}
    </Rnd>
  );
};

export default FreeCanvas;
