import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@mui/styles';

import { Theme } from '@mui/material';
import { selectCurrentDropTargetParams } from '@Redux/project/selectors/base';
import { DropPosition } from '@Constants/dragAndDrop';

interface Props {
  styles: React.CSSProperties;
  isActive: boolean;
}

const useStyles = makeStyles<Theme>((theme) => ({
  divider: (isActive) => ({
    position: 'absolute',
    pointerEvents: 'none',
    zIndex: 10,
    border: `1px solid ${isActive ? '#5A899D' : theme.palette.secondary.main}`,
  }),
}));

function DropPositionMarker({ styles, isActive }: Props) {
  const dropTargetParams = useSelector(selectCurrentDropTargetParams);
  const classes = useStyles();

  const [styleProps, setStyleProps] = useState<React.CSSProperties | null>(
    null,
  );

  const toNum = (value?: string | number) =>
    value ? parseInt(value as string) : 0;

  useEffect(() => {
    const { top, left, height, width } = styles;
    let props: React.CSSProperties | null;
    switch (dropTargetParams?.position) {
      case DropPosition.ABOVE:
        props = {
          top: toNum(top) + 10,
          left: toNum(left) + (toNum(width) / 2 + 10),
          width: 10,
        };
        break;
      case DropPosition.AFTER:
        props = {
          top: toNum(top) + toNum(height) / 2 - 5,
          left: toNum(left) + toNum(width) - 10, // remove right border width
          height: 10,
        };
        break;
      case DropPosition.BELOW:
        props = {
          top: toNum(top) + toNum(height) - 10, // remove bottom border height
          width: 10,
          left: toNum(left) + (toNum(width) / 2 + 10),
        };
        break;
      case DropPosition.BEFORE:
        props = {
          top: toNum(top) + toNum(height) / 2 - 5,
          left: toNum(left) + 10,
          height: 10,
        };
        break;
      default:
        props = null;
    }
    setStyleProps(props);
  }, [dropTargetParams?.position, isActive, styles]);

  if (!styleProps) {
    return null;
  }

  return <div className={classes.divider} style={styleProps} />;
}

export default DropPositionMarker;
