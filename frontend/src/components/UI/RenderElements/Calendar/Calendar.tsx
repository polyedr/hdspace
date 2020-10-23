// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import { makeStyles } from '@material-ui/core';

import { SharedRendererProps } from '../types';
import CalendarWidget from '../../Calendar';

const styles = require('../styles.scss');

const Calendar: React.FC<SharedRendererProps> = React.forwardRef(
  (
    { id, entityStyles, groupStyles, ownStyles, isDisabled, className },
    ref,
  ) => {
    const classes = makeStyles({
      entityStyles: {
        ...entityStyles,
      },

      groupStyles: {
        ...groupStyles,
      },

      ownStyles: {
        ...ownStyles,
      },
    })();

    return (
      <div
        ref={ref}
        id={id}
        data-ls-id={id}
        key={id}
        className={cn(
          className,
          styles.addedCalendar,
          isDisabled && styles.disabled,
          classes.entityStyles,
          classes.groupStyles,
          classes.ownStyles,
        )}
      >
        <CalendarWidget />
      </div>
    );
  },
);

export default Calendar;
