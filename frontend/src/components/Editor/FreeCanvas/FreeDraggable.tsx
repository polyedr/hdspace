import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Rnd, RndDragCallback, RndResizeCallback } from 'react-rnd';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  setActiveElementId,
  updateElementParameters,
  updateElementStyles,
} from '@Redux/project/actions';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import { Entity, StateElement } from '@Src/types';
import RENDERERS from '@Components/UI/RenderElements';
import {
  selectElementById,
  selectIncludesActiveElement,
  selectIsElementActive,
} from '@Redux/project/selectors/element';
import useElementProps from '@Components/Editor/hooks/useElementProps';
import cn from 'classnames';
import Borders from './Borders';

const useStyles = makeStyles({
  rnd: {
    position: 'absolute',
    // overflow: 'hidden',
    zIndex: ({ isActive, zIndex, includesActiveElement }: any) =>
      isActive || includesActiveElement ? 1000 : zIndex,
  },
  resizeHande: {
    zIndex: 1000,
    '&:hover': {
      backgroundColor: 'rgba(136, 136, 136, 0.5)',
    },
  },
  activeResizeHandle: {
    backgroundColor: 'rgba(136, 136, 136, 0.5)',
  },
});

type Props = {
  elementId: StateElement['id'];
  // isActive: boolean;
  includesActiveElement?: boolean;
  lockAspectRatio?: boolean;
};

const FreeDraggable: React.FC<Props> = ({
  elementId,
  // isActive,
  // includesActiveElement,
  // lockAspectRatio,
}) => {
  const dispatch = useDispatch();

  const element = useSelector(selectElementById(elementId));
  const isActive = useSelector(selectIsElementActive(elementId));

  const {
    id,
    parameters: {
      freeCanvas: { left = 0, top = 0, width = 0, height = 0, zIndex = 0 } = {},
    },
    type,
  } = element;

  const includesActiveElement = useSelector(selectIncludesActiveElement(id));

  const [resizeDir, setResizeDir] = useState<any>(false);
  const classes = useStyles({
    isActive,
    zIndex,
    includesActiveElement,
  });

  const currentScreenId = useSelector(selectCurrentScreenId);

  const [hover, setHover] = useState(false);

  const handleInteractionStart = (ev) => {
    ev.stopPropagation();
    dispatch(setActiveElementId(id));
  };

  const handleResizeStop: RndResizeCallback = (
    e,
    dir,
    ref,
    delta,
    position,
  ) => {
    if (
      width === parseInt(ref.style.width) &&
      height === parseInt(ref.style.height) &&
      left === position.x &&
      top === position.y
    ) {
      return;
    }

    dispatch(
      updateElementParameters(
        id,
        {
          ...element.parameters,
          freeCanvas: {
            zIndex,
            width: parseInt(ref.style.width),
            height: parseInt(ref.style.height),
            left: position.x,
            top: position.y,
          },
        },
        { screenId: currentScreenId },
      ),
    );
    dispatch(
      updateElementStyles(
        id,
        {
          width: ref.style.width,
          height: ref.style.height,
        },
        { screenId: currentScreenId },
      ),
    );
    setResizeDir(false);
  };

  const handleDragStop: RndDragCallback = (e, { x, y, node }) => {
    if (x === left && y === top) return;
    const { width, height } = node.getBoundingClientRect();

    dispatch(
      updateElementParameters(
        id,
        {
          ...element.parameters,
          freeCanvas: {
            zIndex,
            width,
            height,
            left: x,
            top: y,
          },
        },
        { screenId: currentScreenId },
      ),
    );
  };

  const elementProps = useElementProps(elementId);

  const Renderer = RENDERERS[type as Entity];

  const isActiveHandle = (dir: string) =>
    resizeDir === dir && classes.activeResizeHandle;

  return (
    <Rnd
      onClick={handleInteractionStart}
      className={classes.rnd}
      onResizeStop={handleResizeStop}
      onDragStop={handleDragStop}
      position={{
        x: left as number,
        y: top as number,
      }}
      {...(width &&
        height && {
          size: {
            width,
            height,
          },
        })}
      onResizeStart={(ev, dir) => {
        handleInteractionStart(ev);
        setResizeDir(dir);
      }}
      onDragStart={handleInteractionStart}
      // lockAspectRatio={lockAspectRatio}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      resizeHandleClasses={{
        bottom: cn(classes.resizeHande, isActiveHandle('bottom')),
        bottomLeft: cn(classes.resizeHande, isActiveHandle('bottomLeft')),
        bottomRight: cn(classes.resizeHande, isActiveHandle('bottomRight')),
        left: cn(classes.resizeHande, isActiveHandle('left')),
        top: cn(classes.resizeHande, isActiveHandle('top')),
        right: cn(classes.resizeHande, isActiveHandle('right')),
        topLeft: cn(classes.resizeHande, isActiveHandle('topLeft')),
        topRight: cn(classes.resizeHande, isActiveHandle('topRight')),
      }}
    >
      <Renderer {...elementProps}>
        {element.children.map((childId) => (
          <FreeDraggable key={childId} elementId={childId} />
        ))}
      </Renderer>

      <Borders element={element} hover={hover} isActive={isActive} />
    </Rnd>
  );
};

export default FreeDraggable;
