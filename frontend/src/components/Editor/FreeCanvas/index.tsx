import React, { useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Rnd, RndResizeCallback } from 'react-rnd';
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
} from '../../../redux/project/actions';
import FREE_CANVAS_RENDERERS from './FreeRenderers';
import { useElementClassNames } from './helpers';

const FreeCanvas = () => {
  const dispatch = useDispatch();

  const ref = useRef<Rnd | null>(null);

  const root = useSelector(selectCurrentRoot);
  const directChildren = useSelector(selectDirectRootChildren);
  const activeElementId = useSelector(selectActiveElementId);
  const currentScreenId = useSelector(selectCurrentScreenId);

  const { entityStyles, groupStyles, ownStyles } = useElementClassNames(root);

  const rootSize = useMemo(() => {
    return Object.values(directChildren).reduce(
      (acc, curr) => {
        const width = curr.parameters.left + curr.parameters.width;
        const height = curr.parameters.top + curr.parameters.height;
        return {
          width: Math.max(width, acc.width, root.parameters.width),
          height: Math.max(height, acc.height, root.parameters.height),
        };
      },
      { width: root.parameters.width, height: root.parameters.height },
    );
  }, [root, directChildren]);

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
      size={rootSize}
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
