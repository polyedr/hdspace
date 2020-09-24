import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { StateElement } from '../../../../redux/project/types';
import { BorderStyles } from '../hooks/useBorderStyles';

const borderStyles = require('./Border.scss');

export enum BorderPosition {
  TOP = 'top',
  BOTTOM = 'bottom',
  LEFT = 'left',
  RIGHT = 'right',
}

export type StyleProps = {
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
  width?: number;
  height?: number;
};

type Props = {
  element: StateElement;
  position: BorderPosition;
  styles: BorderStyles;
  isActive: boolean;
  isDropTarget?: boolean;
  onClick?: (event: React.SyntheticEvent<EventTarget>) => void;
  onRenderProps?: (props: StyleProps) => StyleProps;
};

const Border: React.FC<Props> = ({
  element,
  position,
  styles,
  isActive,
  isDropTarget,
  onClick,
  onRenderProps,
}) => {
  const [styleProps, setStyleProps] = useState<StyleProps | null>(null);
  useEffect(() => {
    const { top, left, right, height } = styles;
    let props: StyleProps | null = null;
    switch (position) {
      case 'top':
        props = {
          top,
          right,
          left,
        } as StyleProps;
        break;
      case 'right':
        props = {
          top,
          right,
          height,
        };
        break;
      case 'bottom':
        props = {
          top: top + height,
          right,
          left,
        } as StyleProps;
        break;
      case 'left':
        props = {
          top,
          left,
          height,
        } as StyleProps;
        break;
      default:
        props = null;
    }
    setStyleProps(props);
  }, [isActive, styles]);

  if (!styleProps) {
    return null;
  }

  return (
    <div
      data-border-id={element.id}
      data-element-name={element.name}
      data-position={position}
      className={cn(
        borderStyles.border,
        (isActive || isDropTarget) && borderStyles.border_active,
      )}
      style={onRenderProps ? onRenderProps(styleProps) : styleProps}
      onClick={onClick}
    />
  );
};

export default Border;
