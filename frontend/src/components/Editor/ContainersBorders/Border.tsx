import React, { useEffect, useState } from 'react';
import cn from 'classnames';

import { NamedItem } from './Borders';

const styles = require('./Border.scss');

type BorderCoordinates = {
  top: number;
  left: number;
  bottom: number;
  right: number;
};

export type BorderDOMProps = {
  coordinates: BorderCoordinates;
  width: number;
  height: number;
};

export type BorderedItem = {
  borderDom: BorderDOMProps;
} & NamedItem;

type BorderProps = {
  item: BorderedItem;
  position: string;
  isActive: boolean;
  onClick?: (event: React.SyntheticEvent<EventTarget>) => void;
};

const Border: React.FC<BorderProps> = ({
  item,
  position,
  isActive,
  onClick,
}) => {
  const [styleProps, setStyleProps] = useState({});

  useEffect(() => {
    const {
      borderDom: { coordinates, height },
    } = item;
    const { top, left, right } = coordinates;
    let styleProps;
    switch (position) {
      case 'top':
        styleProps = {
          top,
          right,
          left,
        };
        break;
      case 'right':
        styleProps = {
          top,
          right,
          height,
        };
        break;
      case 'bottom':
        styleProps = {
          top: top + height,
          right,
          left,
        };
        break;
      case 'left':
        styleProps = {
          top,
          left,
          height,
        };
        break;
      default:
        styleProps = null;
    }
    if (!styleProps) {
      throw new Error(
        `Incorrect position value passed to component ${item.id}: ${position}`,
      );
    }
    setStyleProps(styleProps);
  }, [isActive]);

  return (
    <div
      data-border-id={item.id}
      data-element-name={item.name}
      data-position={position}
      className={cn(styles.border, isActive && styles.border_active)}
      style={styleProps}
      onClick={onClick}
    />
  );
};

export default Border;
