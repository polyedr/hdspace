import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { BoundingStyles, StyleProps } from '@Src/types';
import { makeStyles } from '@material-ui/core/styles';
import BorderPosition from '../constants';

interface Props {
  elementId: string;
  position: BorderPosition;
  styles: BoundingStyles;
  isActive: boolean;
  visiblePreSelect: boolean;
}

const useStyles = makeStyles((theme) => ({
  '@global': {
    '@keyframes sharedHighlight': {
      '0%': {
        borderColor: '#5A899D',
      },
      '50%': {
        borderColor: 'red',
      },
      '100%': {
        borderColor: '#5A899D',
      },
    },
  },
  shared: {
    animation: 'sharedHighlight 1.5s ease-in-out infinite',
  },
  border: ({ position, isActive }: Props) => {
    const borderPosPrefix =
      position.charAt(0).toUpperCase() + position.substring(1);
    return {
      position: 'absolute',
      pointerEvents: 'none',
      zIndex: 10,
      [`border${borderPosPrefix}Width`]: '1px',
      [`border${borderPosPrefix}Style`]: 'solid',
      [`border${borderPosPrefix}Color`]: isActive
        ? '#5A899D'
        : theme.palette.secondary.main,
    };
  },
}));

const Border: React.FC<Props> = (props) => {
  const { elementId, position, styles, isActive, visiblePreSelect } = props;
  const borderStyles = useStyles(props);
  const [styleProps, setStyleProps] = useState<StyleProps | null>(null);

  useEffect(() => {
    const { top, left, height, width } = styles;
    let props: StyleProps | null;
    switch (position) {
      case BorderPosition.TOP:
        props = {
          top,
          left,
          width,
        } as StyleProps;
        break;
      case BorderPosition.RIGHT:
        props = {
          top,
          left: left + width - 1, // remove right border width
          height,
        };
        break;
      case BorderPosition.BOTTOM:
        props = {
          top: top + height - 1, // remove bottom border height
          width,
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
  }, [isActive, position, styles]);

  if (!styleProps) {
    return null;
  }

  return (
    <div
      data-border-id={elementId}
      data-position={position}
      className={cn(
        borderStyles.border,
        visiblePreSelect ? borderStyles.shared : '',
      )}
      style={styleProps}
    />
  );
};

export default Border;
