import React, { useRef, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Rnd, RndResizeCallback } from 'react-rnd';
import { DropTargetMonitor, useDrop } from 'react-dnd';
import cn from 'classnames';
import {
  updateElementParameters,
  createElements,
  setActiveElement,
} from '@Redux/project/actions';
import {
  selectActiveElementId,
  selectCurrentRoot,
  selectDirectRootChildren,
} from '@Redux/project/selectors/element';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import {
  ElementData,
  Normalized,
  StateElement,
  SyntheticElement,
} from '@Src/types';
import { ElementType } from '@Constants/dragAndDrop';
import { selectShowingGrid } from '@Redux/project/selectors/base';
import { useElementClassNames } from './helpers';
import FreeDraggable from './FreeDraggable';

function FreeCanvas() {
  const dispatch = useDispatch();

  const ref = useRef<Rnd | null>(null);

  const root = useSelector(selectCurrentRoot);
  const [className, groupClass] = root.styles.classNames;
  const directChildren: Normalized<StateElement> = useSelector(
    selectDirectRootChildren,
  );
  const activeElementId = useSelector(selectActiveElementId);
  const currentScreenId = useSelector(selectCurrentScreenId);

  const { ownStyles } = useElementClassNames(root);

  const rootSize = useMemo(() => {
    const { width: rootWidh = 0, height: rootHeight = 0 } =
      root.parameters.freeCanvas;

    return Object.values(directChildren).reduce(
      (acc, curr) => {
        const {
          left = 0,
          top = 0,
          width = 0,
          height = 0,
        } = curr.parameters.freeCanvas || {};
        const newWidth = left + parseInt(width.toString());
        const newHeight = top + parseInt(height.toString());
        return {
          width: Math.max(newWidth, +acc.width, +rootWidh),
          height: Math.max(newHeight, +acc.height, +rootHeight),
        };
      },
      {
        width: +rootWidh,
        height: +rootHeight,
      },
    );
  }, [directChildren, root.parameters.freeCanvas]);

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
      const { id, type, name, custom, parameters } =
        dragSource.original as ElementData;
      const rect = resizableElement.current.getBoundingClientRect();

      let elementParameter: any = {
        top: offset.y - rect.y,
        left: offset.x - rect.x,
      };

      if (name === 'Image asset' && parameters?.imageURL) {
        elementParameter = {
          ...elementParameter,
          imageURL: parameters?.imageURL,
        };
      }

      dispatch(
        createElements(
          {
            createdElements: [
              {
                id,
                type,
                name,
                custom,
                parameters: elementParameter,
              },
            ],
            parentId: root.id,
          },
          { screenId: currentScreenId },
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

  const showGrid = useSelector(selectShowingGrid);

  return (
    <Rnd
      ref={(c) => {
        ref.current = c;
      }}
      className={cn(className, groupClass, ownStyles)}
      style={{
        position: 'relative',
        userSelect: 'none',
        display: 'block',
        border: `1px solid ${
          activeElementId === root.id ? '#5A899D' : 'transparent'
        }`,
        background: showGrid ? 'transparent' : '',
      }}
      onClick={() => dispatch(setActiveElement(root.id))}
      enableResizing={false}
      disableDragging
      minWidth="100%"
      minHeight="100%"
      onResize={handleResize}
      onResizeStop={handleResizeStop}
      size={rootSize}
      id="free-canvas-root"
    >
      {Object.values(directChildren).map((element) => (
        <FreeDraggable key={element.id} elementId={element.id} />
      ))}
    </Rnd>
  );
}

export default FreeCanvas;
