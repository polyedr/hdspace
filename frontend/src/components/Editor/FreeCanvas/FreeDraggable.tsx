import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Rnd } from 'react-rnd';
import makeStyles from '@material-ui/core/styles/makeStyles';
import cn from 'classnames';
import { StateElement } from '../../../redux/project/types';
import {
  setActiveElement,
  updateElementParameters,
} from '../../../redux/project/actions';
import {
  selectCurrentScreenId,
  selectProjectClasses,
} from '../../../redux/project/selectors';

const useElementClassNames = (element: StateElement) => {
  const projectClasses = useSelector(selectProjectClasses);

  const [entityClass, groupClass] = element.styles.classNames;
  const entityStyles =
    projectClasses?.find((cssClass: any) => cssClass.className === entityClass)
      ?.rules || {};
  const groupStyles =
    projectClasses?.find((cssClass: any) => cssClass.className === groupClass)
      ?.rules || {};

  return makeStyles({
    entityStyles: {
      ...entityStyles,
    },

    groupStyles: {
      ...groupStyles,
    },

    ownStyles: {
      ...element.styles.ownStyles,
    },
  })();
};

const useStyles = makeStyles({
  rnd: {
    position: 'absolute',
    border: (props: any) =>
      `1px solid ${props.isActive ? 'red' : 'transparent'}`,
    overflow: 'hidden',
    '&:hover': {
      border: (props: any) => `1px solid ${props.isActive ? 'red' : '#ccc'}`,
    },
  },
  resizeHandle: {},
});

type Props = {
  element: StateElement;
  isActive: boolean;
};

const FreeDraggable: React.FC<Props> = ({ element, isActive, children }) => {
  const dispatch = useDispatch();
  const {
    id,
    parameters: { left, top, width, height },
  } = element;
  const classes = useStyles({ isActive });

  const { entityStyles, groupStyles, ownStyles } = useElementClassNames(
    element,
  );

  const currentScreenId = useSelector(selectCurrentScreenId);

  const handleClick = (ev) => {
    ev.stopPropagation();
    dispatch(setActiveElement(id));
  };

  const handleInteractionStart = () => {
    dispatch(setActiveElement(id));
  };

  const handleResizeStop = (e, dir, ref, delta, position) => {
    const resultWidth = width + delta.width;
    const resultHeight = height + delta.height;

    if (
      width === resultWidth &&
      height === resultHeight &&
      left === position.x &&
      top === position.y
    ) {
      return;
    }

    dispatch(
      updateElementParameters(
        id,
        {
          width: resultWidth,
          height: resultHeight,
          left: position.x,
          top: position.y,
        },
        { screenId: currentScreenId },
      ),
    );
  };

  const handleDragStop = (e, { x, y }) => {
    if (x === left && y === top) return;

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
      onResizeStop={handleResizeStop}
      onDragStop={handleDragStop}
      bounds="parent"
      position={{
        x: left,
        y: top,
      }}
      size={{
        width,
        height,
      }}
      onMouseDown={handleInteractionStart}
      resizeHandleClasses={{
        top: classes.resizeHandle,
        topRight: classes.resizeHandle,
        right: classes.resizeHandle,
        bottomRight: classes.resizeHandle,
        bottom: classes.resizeHandle,
        bottomLeft: classes.resizeHandle,
        left: classes.resizeHandle,
        topLeft: classes.resizeHandle,
      }}
    >
      <div
        className={cn(entityStyles, groupStyles, ownStyles)}
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        {children}
      </div>
    </Rnd>
  );
};

export default FreeDraggable;
