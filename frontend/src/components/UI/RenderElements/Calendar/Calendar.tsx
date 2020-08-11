/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import React from 'react';
import cn from 'classnames';
import { makeStyles } from '@material-ui/core';

import { CalendarWidget } from '$components/UI/Calendar';

import { SharedRendererProps } from '../types';

const styles = require('../styles.scss');

const Calendar: React.FC<SharedRendererProps> = ({
  id,
  entityStyles,
  groupStyles,
  ownStyles,
  isDisabled,
  sortableId,
  className,
  elementRef,
}) => {
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
      ref={elementRef}
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn(
        className,
        styles.addedCalendar,
        isDisabled && styles.disabled,
        classes.entityStyles,
        classes.groupStyles,
        classes.ownStyles,
      )}
      tabIndex={isDisabled ? 0 : -1}
    >
      <CalendarWidget />
    </div>
  );
};

export { Calendar };
