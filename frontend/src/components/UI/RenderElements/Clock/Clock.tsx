// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import { makeComponentStyles } from '../styles';

import { ClockRendererProps } from '../types';
import ClockWidget from '../../Clock';

const useStyles = makeComponentStyles();

const Clock: React.FC<ClockRendererProps> = React.forwardRef((props, ref) => {
  const { id, params, className } = props;

  const classes = useStyles(props);

  return (
    <div
      ref={ref}
      id={id}
      data-ls-id={id}
      key={id}
      className={cn(
        className,
        classes.entityStyles,
        classes.groupStyles,
        classes.ownStyles,
      )}
    >
      <ClockWidget
        size={typeof params.width === 'number' ? params.width : undefined}
      />
    </div>
  );
});

export default Clock;
