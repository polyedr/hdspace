import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Rnd, RndDragCallback, RndResizeCallback } from 'react-rnd';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  setActiveElement,
  updateElementParameters,
} from '@Redux/project/actions';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import { StateElement } from '@Src/types';
import Borders from './Borders';

const useStyles = makeStyles({
  rnd: {
    position: 'absolute',
    overflow: 'hidden',
    zIndex: ({ isActive, zIndex, includesActiveElement }: any) =>
      isActive || includesActiveElement ? 1000 : zIndex,
  },
});

type Props = {
  element: StateElement;
  isActive: boolean;
  includesActiveElement?: boolean;
  lockAspectRatio?: boolean;
};

const FreeDraggable: React.FC<Props> = ({
  element,
  isActive,
  includesActiveElement,
  lockAspectRatio,
  children,
}) => {
  const dispatch = useDispatch();

  const {
    id,
    parameters: { left, top, width, height, zIndex = 0 },
  } = element;
  const classes = useStyles({ isActive, zIndex, includesActiveElement });
  const currentScreenId = useSelector(selectCurrentScreenId);

  const [hover, setHover] = useState(false);

  const handleInteractionStart = (ev) => {
    ev.stopPropagation();
    dispatch(setActiveElement(id));
  };

  const handleResizeStop: RndResizeCallback = (
    e,
    dir,
    ref,
    delta,
    position,
  ) => {
    if (
      width === ref.style.width &&
      height === ref.style.height &&
      left === position.x &&
      top === position.y
    ) {
      return;
    }

    dispatch(
      updateElementParameters(
        id,
        {
          width: parseInt(ref.style.width),
          height: parseInt(ref.style.height),
          left: position.x,
          top: position.y,
        },
        { screenId: currentScreenId },
      ),
    );
  };

  const handleDragStop: RndDragCallback = (e, { x, y, node }) => {
    if (x === left && y === top) return;
    const { width, height } = node.getBoundingClientRect();

    dispatch(
      updateElementParameters(
        id,
        {
          width,
          height,
          left: x,
          top: y,
        },
        { screenId: currentScreenId },
      ),
    );
  };

  return (
    <Rnd
      onClick={handleInteractionStart}
      className={classes.rnd}
      onResizeStop={handleResizeStop}
      onDragStop={handleDragStop}
      position={{
        x: left,
        y: top,
      }}
      size={
        width &&
        height && {
          width,
          height,
        }
      }
      onResizeStart={handleInteractionStart}
      onDragStart={handleInteractionStart}
      lockAspectRatio={lockAspectRatio}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {children}

      <Borders element={element} hover={hover} isActive={isActive} />
    </Rnd>
  );
};

export default FreeDraggable;
