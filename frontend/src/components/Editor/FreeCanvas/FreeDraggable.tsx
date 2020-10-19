import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Rnd } from 'react-rnd';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { StateElement } from '../../../redux/project/types';
import {
  setActiveElement,
  updateElementParameters,
} from '../../../redux/project/actions';
import { selectCurrentScreenId } from '../../../redux/project/selectors';
import { Paragraph } from './FreeRenderers';

const useStyles = makeStyles({
  rnd: {
    cursor: 'move',
    position: 'absolute',
    outline: (props: any) => props.isActive && '1px solid red',
    backgroundColor: '#fff',
  },
});

type Props = {
  element: StateElement;
  isActive: boolean;
};

const FreeDraggable: React.FC<Props> = ({ element, isActive }) => {
  const dispatch = useDispatch();
  const {
    id,
    parameters: { left, top, width, height },
  } = element;
  const classes = useStyles({ left, top, isActive });

  const currentScreenId = useSelector(selectCurrentScreenId);

  const handleClick = (ev) => {
    ev.stopPropagation();
    dispatch(setActiveElement(id));
  };

  const handleInteractionStart = () => {
    dispatch(setActiveElement(id));
  };

  const handleResizeStop = (e, dir, ref, delta, position) => {
    dispatch(
      updateElementParameters(
        id,
        {
          width: width + delta.width,
          height: height + delta.height,
          left: position.x,
          top: position.y,
        },
        { screenId: currentScreenId },
      ),
    );
  };

  const handleDragStop = (e, { x, y }) => {
    dispatch(
      updateElementParameters(
        id,
        {
          left: x,
          top: y,
        },
        { screenId: currentScreenId },
      ),
    );
  };

  return (
    <Rnd
      onClick={handleClick}
      className={classes.rnd}
      onResizeStart={handleInteractionStart}
      onResizeStop={handleResizeStop}
      onDragStart={handleInteractionStart}
      onDragStop={handleDragStop}
      position={{
        x: left,
        y: top,
      }}
      size={{
        width,
        height,
      }}
    >
      <Paragraph element={element} />
    </Rnd>
  );
};

export default FreeDraggable;
