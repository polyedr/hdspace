import { makeStyles } from '@material-ui/core';
import { setActiveVIARegion, updateVIARegion } from '@Redux/project/actions';
import { selectIsRegionActive } from '@Redux/project/selectors/via';
import prevent from '@Utils/preventEvent';
import cn from 'classnames';
import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Rnd, RndDragCallback, RndResizeCallback } from 'react-rnd';
import { VIARegion } from '../../../types';

const useStyles = makeStyles({
  region: {
    border: '1px solid black',
  },
  active: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    zIndex: 999,
  },
  resizeHandle: {
    display: ({ isActive }: any) => (isActive ? 'block' : 'none'),
    width: '12px !important',
    height: '12px !important',
    backgroundColor: 'yellow',
    border: '1px solid black',
  },
  topHandle: {
    transform: 'translateX(-50%)',
    left: '50% !important',
    top: '-6px !important',
  },
  topRightHandle: {
    right: '-6px !important',
    top: '-6px !important',
  },
  rightHandle: {
    transform: 'translateY(-50%)',
    right: '-6px !important',
    top: '50% !important',
  },
  bottomRightHandle: {
    right: '-6px !important',
    bottom: '-6px !important',
  },
  bottomHandle: {
    bottom: '-6px !important',
    left: '50% !important',
    transform: 'translateX(-50%)',
  },
  bottomLeftHandle: {
    bottom: '-6px !important',
    left: '-6px !important',
  },
  leftHandle: {
    top: '50% !important',
    left: '-6px !important',
    transform: 'translateY(-50%)',
  },
  topLeftHandle: {
    left: '-6px !important',
    top: '-6px !important',
  },
});

type Props = {
  region: VIARegion;
};

const Region: FC<Props> = ({ region }) => {
  const dispatch = useDispatch();
  const { id, shape_attributes } = region;
  const isActive = useSelector(selectIsRegionActive(region.id));
  const classes = useStyles({ isActive });
  const { height, width, x, y } = shape_attributes;

  const selectRegion = (ev) => {
    prevent(ev);
    dispatch(setActiveVIARegion(id));
  };

  const onDragStop: RndDragCallback = (e, d) => {
    if (d.x === x && d.y === y) return;

    dispatch(
      updateVIARegion(region.id, {
        ...region,
        shape_attributes: {
          ...region.shape_attributes,
          x: d.x,
          y: d.y,
        },
      }),
    );
  };

  const onResizeStop: RndResizeCallback = (
    e,
    direction,
    ref,
    delta,
    position,
  ) => {
    if (
      width === parseInt(ref.style.width) &&
      height === parseInt(ref.style.height) &&
      x === position.x &&
      y === position.y
    ) {
      return;
    }

    dispatch(
      updateVIARegion(region.id, {
        ...region,
        shape_attributes: {
          ...region.shape_attributes,
          width: parseInt(ref.style.width),
          height: parseInt(ref.style.height),
          ...position,
        },
      }),
    );
  };

  return (
    <Rnd
      className={cn(classes.region, isActive && classes.active)}
      bounds="parent"
      size={{
        width,
        height,
      }}
      position={{
        x,
        y,
      }}
      onDragStop={onDragStop}
      onResizeStop={onResizeStop}
      onDragStart={selectRegion}
      onResizeStart={selectRegion}
      onClick={selectRegion}
      resizeHandleClasses={{
        top: cn(classes.resizeHandle, classes.topHandle),
        topRight: cn(classes.resizeHandle, classes.topRightHandle),
        right: cn(classes.resizeHandle, classes.rightHandle),
        bottomRight: cn(classes.resizeHandle, classes.bottomRightHandle),
        bottom: cn(classes.resizeHandle, classes.bottomHandle),
        bottomLeft: cn(classes.resizeHandle, classes.bottomLeftHandle),
        left: cn(classes.resizeHandle, classes.leftHandle),
        topLeft: cn(classes.resizeHandle, classes.topLeftHandle),
      }}
      data-testid={id}
    />
  );
};

export default Region;
