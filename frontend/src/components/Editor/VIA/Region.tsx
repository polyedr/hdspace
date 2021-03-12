import { makeStyles } from '@material-ui/core';
import { updateViaRegion } from '@Redux/project/actions';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { Rnd, RndDragCallback, RndResizeCallback } from 'react-rnd';
import { VIARegion } from '../../../types';

const useStyles = makeStyles({
  region: {
    border: '1px solid black',
  },
});

type Props = {
  region: VIARegion;
};

const Region: FC<Props> = ({ region }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { height, width, x, y } = region.shape_attributes;

  const onDragStop: RndDragCallback = (e, d) => {
    dispatch(
      updateViaRegion(region.id, {
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
    dispatch(
      updateViaRegion(region.id, {
        ...region,
        shape_attributes: {
          ...region.shape_attributes,
          width: +ref.style.width,
          height: +ref.style.height,
          ...position,
        },
      }),
    );
  };

  return (
    <Rnd
      className={classes.region}
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
    >
      {region.region_attributes['HTML element']}
    </Rnd>
  );
};

export default Region;
