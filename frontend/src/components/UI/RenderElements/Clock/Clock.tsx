import React from 'react';
import cn from 'classnames';
import { makeStyles } from '@material-ui/core';

import { ClockWidget } from '$components/UI/Clock';

import { ClockRendererProps } from '../types';
const styles = require('../styles.scss');

const Clock = (props: ClockRendererProps) => {
  const {
    id,
    params,
    entityStyles,
    groupStyles,
    ownStyles,
    sortableId,
    isDisabled,
    className,
    elementRef,
  } = props;

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
        classes.entityStyles,
        classes.groupStyles,
        classes.ownStyles,
      )}
      tabIndex={isDisabled ? 0 : -1}
    >
      <ClockWidget
        size={typeof params.width === 'number' ? params.width : undefined}
      />
    </div>
  );
}

export { Clock };
