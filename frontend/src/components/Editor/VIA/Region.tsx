import { makeStyles } from '@material-ui/core';
import { setActiveVIARegion, updateVIARegion } from '@Redux/project/actions';
import { selectIsRegionActive } from '@Redux/project/selectors/base';
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
});

type Props = {
  region: VIARegion;
};

const Region: FC<Props> = ({ region }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { id, region_attributes, shape_attributes } = region;
  const isActive = useSelector(selectIsRegionActive(region.id));
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
    >
      {region_attributes['HTML element']}
    </Rnd>
  );
};

export default Region;
