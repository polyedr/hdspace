import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';
import cn from 'classnames';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Rnd, RndDragCallback, RndResizeCallback } from 'react-rnd';
import prevent from '@Utils/preventEvent';
import { selectIsRegionActive } from '@Redux/project/selectors/via';
import { setActiveVIARegion, updateVIARegion } from '@Redux/project/actions';
import { VIARegion } from '../../../types';
import VIABorders from './VIABorders';

const useStyles = makeStyles<
  Theme,
  { isActive: boolean; layer: number; select: boolean }
>({
  region: {
    backgroundColor: ({ isActive }) =>
      isActive ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
    border: '1px solid black',
    zIndex: ({ select, isActive }) => (select && isActive ? 999 : 0),
    position: 'relative',
  },
  resizeHandle: {
    display: ({ isActive }) => (isActive ? 'block' : 'none'),
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

interface Props {
  region: VIARegion;
}

const Region: FC<Props> = ({ region }) => {
  const dispatch = useDispatch();
  const [select, setSelect] = useState(true);
  const { id, shape_attributes, layer = 0 } = region;
  const isActive = useSelector(selectIsRegionActive(region.id));
  const classes = useStyles({ isActive, layer, select });
  const { height, width, x, y } = shape_attributes;

  const selectRegion = (ev) => {
    prevent(ev);
    setSelect(false);
    dispatch(setActiveVIARegion(id, false));
  };

  const onClickRegion = (ev) => {
    prevent(ev);
    setSelect(true);
    dispatch(setActiveVIARegion(id, true));
  };
  const onDragStop: RndDragCallback = (e, d) => {
    if (d.x === x && d.y === y) return;
    setSelect(true);
    dispatch(setActiveVIARegion(id, false));
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
    setSelect(true);
    dispatch(setActiveVIARegion(id, false));
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

  useEffect(() => {
    const keyPressHandler = (e) => {
      if (isActive) {
        let newX = x;
        let newY = y;
        if (e.key === 'ArrowLeft') newX--;
        else if (e.key === 'ArrowUp') newY--;
        else if (e.key === 'ArrowRight') newX++;
        else if (e.key === 'ArrowDown') newY++;
        dispatch(
          updateVIARegion(region.id, {
            ...region,
            shape_attributes: {
              ...region.shape_attributes,
              x: newX,
              y: newY,
            },
          }),
        );
      }
    };
    document.addEventListener('keydown', keyPressHandler);
    return () => {
      document.removeEventListener('keydown', keyPressHandler);
    };
  }, [x, y, isActive, region, dispatch]);

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
      onDragStart={selectRegion}
      onResizeStart={selectRegion}
      onClick={onClickRegion}
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
    >
      {isActive && (
        <div>
          <div
            style={{
              borderTop: '1px solid red',
              left: -x - 7,
              width: x,
              top: height / 2,
              position: 'absolute',
              textAlign: 'center',
              color: 'red',
              fontSize: 'x-small',
              fontWeight: 'bold',
            }}
          >
            {`${Math.round((Number(x) * 100) / 100)}px`}
          </div>

          <div
            style={{
              borderLeft: '1px solid red',
              height: y,
              position: 'absolute',
              left: width / 2,
              top: -y - 7,
            }}
          >
            <span
              style={{
                color: 'red',
                fontSize: 'x-small',
                fontWeight: 'bold',
                top: '50%',
                position: 'absolute',
              }}
            >
              {`${Math.round((Number(y) * 100) / 100)}px`}
            </span>
          </div>
        </div>
      )}
      <VIABorders />
    </Rnd>
  );
};

export default Region;
