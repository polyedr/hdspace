import { makeStyles } from '@material-ui/core';
import React, { FC, useState } from 'react';
import { Rnd } from 'react-rnd';
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
  const classes = useStyles();
  const { height, width, x, y } = region.shape_attributes;

  const [size, setSize] = useState<any>({ width, height });
  const [position, setPosition] = useState({ x, y });

  return (
    <Rnd
      className={classes.region}
      bounds="parent"
      size={size}
      position={position}
      onDragStop={(e, d) => {
        setPosition({ x: d.x, y: d.y });
      }}
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
