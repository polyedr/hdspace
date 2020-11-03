// @ts-nocheck

import React from 'react';
import cn from 'classnames';

import { SharedRendererProps } from '../types';
import { makeComponentStyles } from '../styles';
import CalendarWidget from '../../Calendar';
import useEventHandlers from '../useEventHandlers';

// const styles = require('../styles.scss');
const useStyles = makeComponentStyles();

const Calendar: React.FC<SharedRendererProps> = React.forwardRef(
  (props, ref) => {
    const { id, isDisabled, className } = props;
    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props);

    return (
      <div
        ref={ref}
        id={id}
        data-ls-id={id}
        key={id}
        className={cn(
          className,
          isDisabled && classes.disabled,
          classes.entityStyles,
          classes.groupStyles,
          classes.ownStyles,
        )}
        {...eventHandlers}
      >
        <CalendarWidget />
      </div>
    );
  },
);

export default Calendar;
