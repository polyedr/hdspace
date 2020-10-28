import React, { useEffect, useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { StateElement } from '../../../../redux/project/types';
import { BorderPosition } from '../constants';
import { BorderStyles, StyleProps } from '../types';

// const borderStyles = require('./Border.scss');

type Props = {
  element: StateElement;
  position: BorderPosition;
  styles: BorderStyles;
  isActive: boolean;
  isDropTarget?: boolean;
  onClick?: (event: React.SyntheticEvent<EventTarget>) => void;
};

const useStyles = makeStyles((theme) => ({
  border: ({ position, isActive, isDropTarget }: Props) => {
    const borderPosPrefix =
      position.charAt(0).toUpperCase() + position.substring(1);
    return {
      position: 'absolute',
      pointerEvents: 'none',
      [`border${borderPosPrefix}Width`]: '1px',
      [`border${borderPosPrefix}Style`]: 'solid',
      [`border${borderPosPrefix}Color`]:
        isActive || isDropTarget ? '#5A899D' : theme.palette.secondary.main,
    };
  },
}));

const Border: React.FC<Props> = (props) => {
  const { element, position, styles, isActive, onClick } = props;
  const borderStyles = useStyles(props);
  const [styleProps, setStyleProps] = useState<StyleProps | null>(null);
  useEffect(() => {
    const { top, left, right, height } = styles;
    let props: StyleProps | null = null;
    switch (position) {
      case BorderPosition.TOP:
        props = {
          top,
          right,
          left,
        } as StyleProps;
        break;
      case BorderPosition.RIGHT:
        props = {
          top,
          right,
          height,
        };
        break;
      case BorderPosition.BOTTOM:
        props = {
          top: top + height,
          right,
          left,
        } as StyleProps;
        break;
      case BorderPosition.LEFT:
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
      className={borderStyles.border}
      style={styleProps}
      onClick={onClick}
    />
  );
};

export default Border;
