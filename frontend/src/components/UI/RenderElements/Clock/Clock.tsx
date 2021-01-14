// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import { makeComponentStyles } from '../styles';
import { ClockRendererProps } from '../types';
import ClockWidget from '../../Clock';
import useEventHandlers from '../useEventHandlers';

const useStyles = makeComponentStyles('clock');

const Clock: React.FC<ClockRendererProps> = React.forwardRef((props, ref) => {
  const { id, params, className, groupClass } = props;

  const classes = useStyles(props);
  const eventHandlers = useEventHandlers(props);

  return (
    <div
      ref={ref}
      id={id}
      data-ls-id={id}
      key={id}
      className={cn(className, groupClass, classes.ownStyles)}
      {...eventHandlers}
    >
      <ClockWidget
        size={typeof params.width === 'number' ? params.width : undefined}
      />
    </div>
  );
});

export default Clock;
