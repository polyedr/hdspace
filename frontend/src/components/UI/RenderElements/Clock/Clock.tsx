// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import { makeComponentStyles } from '../styles';
import { ClockRendererProps } from '../types';
import useEventHandlers from '../useEventHandlers';
import ClockWidget from '../../Widgets/Clock';

const useStyles = makeComponentStyles('clock');

const Calendar: React.FC<ClockRendererProps> = React.forwardRef(
  (props, ref) => {
    const { id, className, groupClass } = props;

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
        <ClockWidget id={id} />
      </div>
    );
  },
);

export default Calendar;
