import { makeStyles } from '@material-ui/core';
import { updateViaRegion } from '@Redux/project/actions';
import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Rnd, RndDragCallback } from 'react-rnd';
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

  const [size, setSize] = useState<any>({ width, height });
  const [position, setPosition] = useState({ x, y });

  return (
    <Rnd
      className={classes.region}
      bounds="parent"
      size={size}
      position={{
        x,
        y,
      }}
      onDragStop={onDragStop}
      onResizeStop={(e, direction, ref, delta, position) => {
        setSize({
          width: ref.style.width,
          height: ref.style.height,
        });
        setPosition({
          ...position,
        });
      }}
    >
      {region.region_attributes['HTML element']}
    </Rnd>
  );
};

export default Region;
